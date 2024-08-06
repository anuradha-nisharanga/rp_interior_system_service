package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Role;
import com.bit.rp_interior_system.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/role")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController (RoleService roleService){
        this.roleService = roleService;
    }

    @GetMapping("/list")
    @ResponseBody
    public List<Role> getAllRoles(){
        return roleService.getAllRoles();
    }
}
