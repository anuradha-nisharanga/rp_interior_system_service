package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Role;
import com.bit.rp_interior_system.repository.RoleRepository;
import com.bit.rp_interior_system.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl (RoleRepository roleRepository){
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
