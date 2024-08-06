package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Module;
import com.bit.rp_interior_system.repository.ModuleRepository;
import com.bit.rp_interior_system.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;

    @Autowired
    public ModuleServiceImpl(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @Override
    public List<Module> getModuleByRole(Integer roleId) {
        return moduleRepository.getModuleByRole(roleId);
    }
}
