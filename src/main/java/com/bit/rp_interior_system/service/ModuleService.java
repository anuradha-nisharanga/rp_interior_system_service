package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Module;

import java.util.List;

public interface ModuleService {
    List<Module> getAllModules();

    List<Module> getModuleByRole(Integer roleId);
}
