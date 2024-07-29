package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Module;
import com.bit.rp_interior_system.service.ModuleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/module")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping("/list")
    @ResponseBody
    public List<Module> getAllModules(){
        return moduleService.getAllModules();
    }

    @GetMapping(value = "/list-by-role", params =  {"roleId"})
    public List<Module> getByRole (@RequestParam("roleId") Integer roleId){
        return moduleService.getModuleByRole(roleId);
    }
}
