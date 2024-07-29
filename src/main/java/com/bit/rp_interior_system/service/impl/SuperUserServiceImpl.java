package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Role;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Service
public class SuperUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    @Autowired
    public SuperUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User extUser = userRepository.getUserByUserName(username);
        Set<GrantedAuthority> userRoles = new HashSet<GrantedAuthority>();

        for (Role role: extUser.getRoles()){
            userRoles.add(new SimpleGrantedAuthority(role.getName()));
        }

        ArrayList <GrantedAuthority> grantedAuthorities = new
                ArrayList<GrantedAuthority>(userRoles);

        UserDetails user = new org.springframework.security.core.userdetails.User(
                extUser.getUsername(), extUser.getPassword(), extUser.getStatus(), true, true, true, grantedAuthorities
        );

        return user;
    }
}
