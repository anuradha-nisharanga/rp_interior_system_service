package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Privilege;
import com.bit.rp_interior_system.model.dto.PrivilegeDto;
import com.bit.rp_interior_system.service.PrivilegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/privilege")
public class PrivilegeController {

    private final PrivilegeService privilegeService;
    @Autowired
    public PrivilegeController(PrivilegeService privilegeService){
        this.privilegeService = privilegeService;
    }

    @PostMapping("/create")
    @ResponseBody
    public String createPrivilege(@RequestBody PrivilegeDto privilegeDto){
        return privilegeService.createPrivilege(privilegeDto);
    }

    @GetMapping("/find")
    @ResponseBody
    public List<Privilege> getAllPrivileges(){
        return privilegeService.getAllPrivieleges();
    }

    @PutMapping("/update")
    @ResponseBody
    public String updatePrivilege(@RequestBody PrivilegeDto privilegeDto){
        return privilegeService.updatePrivilege(privilegeDto);
    }

    @DeleteMapping("/delete")
    public String deletePrivilege(@RequestBody PrivilegeDto privilegeDto){
        return privilegeService.deletePrivilege(privilegeDto);
    }

    @GetMapping("/by-logged-user-module/{moduleName}")
    public HashMap<String, Boolean> getPrivilegeByLogUserModule(@PathVariable("moduleName") String moduleName){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return privilegeService.getAllPrivilegeByUserModule(auth.getName(), moduleName);
    }

    @GetMapping("")
    @RequestMapping("/ui")
    public ModelAndView PrivilegeUI(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewPrivilege= new ModelAndView();
        //get login user name
        viewPrivilege.addObject("loggedUser", auth.getName());
        viewPrivilege.setViewName("privilege.html");
        viewPrivilege.addObject("title", "Privilege : BIT Project 2023");
        return viewPrivilege;
    }
}
