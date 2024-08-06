package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.UserDto;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final PrivilegeService privilegeService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder,
                           PrivilegeService privilegeService){
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.privilegeService = privilegeService;
    }
    @Override
    public String createUser(UserDto userDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"user");
        if(!logUserPrivilege.get("insert")){
            return "Insert not completed: you have no privilege";
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .password(bCryptPasswordEncoder.encode(userDto.getPassword()))
                .email(userDto.getEmail())
                .createdDate(LocalDateTime.now())
                .status(userDto.getStatus())
                .note(userDto.getNote())
                .imageUrl(userDto.getImageUrl())
                .employee(userDto.getEmployee())
                .roles(userDto.getRoles())
                .build();

        // check for unique values
        try{
            Optional<User> userByEmail = userRepository.findByEmail(userDto.getEmail());
            if (userByEmail.isPresent()){
                return "Save not completed: insert email already exist";
            }
            Optional<User> userByUserName = userRepository.findByUsername(userDto.getUsername());
            if (userByUserName.isPresent()){
                return "Save not completed: Insert username already exist";
            }

            userRepository.save(user);
            log.info("Created User | User no {}", user.getUsername());
            return "OK";
        } catch (Exception e) {
            return "Save not completed: " + e.getMessage();
        }
    }

    @Override
    public List<User> getAllUsers() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"user");
        if(!logUserPrivilege.get("select")){
            return null;
        }
        return  userRepository.findAll();
    }

    @Override
    public String updateUser(UserDto userDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"user");
        if(!logUserPrivilege.get("update")){
            return "Update not completed: you have no privilege";
        }

        Optional<User> userById = userRepository.findById(userDto.getId());
        Optional<User> userByUsername = userRepository.findByUsername(userDto.getUsername());
        if (userById.isEmpty()){
            throw new RuntimeException("User not found");
        }
        if (userByUsername.isPresent() && !userDto.getId().equals(userByUsername.get().getId())){
            throw new RuntimeException("User name already exist");
        }

        User user = userById.get();
        user.setEmail(userDto.getEmail());
        user.setPassword(user.getPassword());
        user.setUsername(userDto.getUsername());
        user.setStatus(userDto.getStatus());
        user.setRoles(userDto.getRoles());
        try {
            user.setUpdatedDate(LocalDateTime.now());
            userRepository.save(user);
            return "OK";
        }
        catch (Exception e){
            return "update not completed : " + e.getMessage();
        }
    }

    @Override
    public String deleteUser(UserDto userDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"user");
        if(!logUserPrivilege.get("delete")){
            return "Delete not completed: you have no privilege";
        }

        Optional<User> userOptional = userRepository.findById(userDto.getId());

        if (userOptional.isEmpty()){
            throw new RuntimeException("user not found");
        }
        try{
            User user = userOptional.get();
            user.setStatus(false);
            userRepository.save(user);
            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }


}
