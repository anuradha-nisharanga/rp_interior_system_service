package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Privilege;
import com.bit.rp_interior_system.model.dto.PrivilegeDto;
import com.bit.rp_interior_system.repository.PrivilegeRepository;
import com.bit.rp_interior_system.service.PrivilegeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
@Slf4j
@Service
public class PrivilegeServiceImpl implements PrivilegeService {

    private final PrivilegeRepository privilegeRepository;

    public PrivilegeServiceImpl(PrivilegeRepository privilegeRepository) {
        this.privilegeRepository = privilegeRepository;
    }

    @Override
    public String createPrivilege(PrivilegeDto privilegeDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = getPrivilegeByModule(auth.getName(),"privilege");
        if(!logUserPrivilege.get("insert")){
            return "Insert not completed: you have no privilege";
        }

        Privilege extPrivilege = privilegeRepository.getByRoleModule(privilegeDto.getRole().getId(), privilegeDto.getModule().getId());
        if (extPrivilege != null){
            return "Save not Completed : Privilege Already exist by given role and module";
        }
        try {
            Privilege privilege = Privilege.builder()
                    .view(privilegeDto.getView())
                    .create(privilegeDto.getCreate())
                    .edit(privilegeDto.getEdit())
                    .remove(privilegeDto.getRemove())
                    .createdDate(LocalDateTime.now())
                    .role(privilegeDto.getRole())
                    .module(privilegeDto.getModule())
                    .build();
            privilegeRepository.save(privilege);
            return "OK";
        } catch (Exception e) {
            return  "Save not Completed:" + e.getMessage();
        }

    }

    @Override
    public List<Privilege> getAllPrivieleges() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = getPrivilegeByModule(auth.getName(),"privilege");
        if(!logUserPrivilege.get("select")){
            return null;
        }
        return privilegeRepository.findAll();
    }

    @Override
    public String updatePrivilege(PrivilegeDto privilegeDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = getPrivilegeByModule(auth.getName(),"privilege");
        if(!logUserPrivilege.get("update")){
            return "Update not completed: you have no privilege";
        }

        Optional<Privilege> privilegeById = privilegeRepository.findById(privilegeDto.getId());
        if (privilegeById.isEmpty()){
           throw new RuntimeException("Privilege Is Not Found");
        }
        Privilege privilege = privilegeById.get();
        privilege.setCreate(privilegeDto.getCreate());
        privilege.setEdit(privilegeDto.getEdit());
        privilege.setView(privilegeDto.getView());
        privilege.setRemove(privilegeDto.getRemove());
        privilege.setRole(privilegeDto.getRole());
        privilege.setModule(privilegeDto.getModule());

        try {
            privilege.setUpdatedDate(LocalDateTime.now());
            privilegeRepository.save(privilege);
            return "OK";
        } catch (Exception e) {
            return "Privilege Update not completed : " + e.getMessage();
        }
    }

    @Override
    public String deletePrivilege(PrivilegeDto privilegeDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = getPrivilegeByModule(auth.getName(),"privilege");
        if(!logUserPrivilege.get("delete")){
            return "Delete not completed: you have no privilege";
        }

        log.info("Delete privilege");
        Optional<Privilege> privilegeById = privilegeRepository.findById(privilegeDto.getId());
        if (privilegeById.isEmpty()){
            throw new RuntimeException("Privilege Is Not Found");
        }
        try{
            Privilege existPrivilege = privilegeById.get();
            existPrivilege.setView(false);
            existPrivilege.setCreate(false);
            existPrivilege.setEdit(false);
            existPrivilege.setRemove(false);
            existPrivilege.setDeletedDate(LocalDateTime.now());
            privilegeRepository.save(existPrivilege);
            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

    @Override
    public HashMap<String, Boolean> getAllPrivilegeByUserModule(String username, String moduleName) {
        return getPrivilegeByModule(username, moduleName);
    }

    public HashMap<String, Boolean> getPrivilegeByModule(String username, String moduleName){
        HashMap<String, Boolean> userPrivilege = new HashMap<String,Boolean>();
        if (username.equals("Admin")){
            userPrivilege.put("select",true);
            userPrivilege.put("insert",true);
            userPrivilege.put("update",true);
            userPrivilege.put("delete",true);
        }
        else{
            String userPrivilegeUsers = privilegeRepository.getPrivilegeByUserModule(username, moduleName);
            log.info("user privilege userPrivilegeUsers");
            String[] userPrivilegeList = userPrivilegeUsers.split(",");
            userPrivilege.put("select",userPrivilegeList[0].equals("1"));
            userPrivilege.put("insert",userPrivilegeList[1].equals("1"));
            userPrivilege.put("update",userPrivilegeList[2].equals("1"));
            userPrivilege.put("delete",userPrivilegeList[3].equals("1"));
        }
        return userPrivilege;
    }
}
