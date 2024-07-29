package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Material;
import com.bit.rp_interior_system.model.MaterialCategory;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.MaterialDto;
import com.bit.rp_interior_system.repository.MaterialCategoryRepository;
import com.bit.rp_interior_system.repository.MaterialRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.MaterialService;
import com.bit.rp_interior_system.service.PrivilegeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final PrivilegeService privilegeService;
    private final UserRepository userRepository;
    private final MaterialCategoryRepository materialCategoryRepository;
    @Override
    public String createMaterial(MaterialDto materialDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"customer");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        Material material = Material.builder()
                .name(materialDto.getName())
                .description(materialDto.getDescription())
                .image(materialDto.getImage())
                .createdDate(LocalDateTime.now())
                .quantity(materialDto.getQuantity())
                .status(materialDto.getStatus())
                .unitPrice(materialDto.getUnitPrice())
                .reorderPoint(materialDto.getReorderPoint())
                .materialCategory(materialDto.getMaterialCategory())
                .build();

        String materialCodeNo = materialRepository.nextMaterialCodeNo();
        material.setCode(materialCodeNo != null ? materialCodeNo : "M00001");

        //set log user value
        User logedUser = userRepository.getUserByUserName(auth.getName());
        material.setCreatedUser(logedUser);
        material.setCreatedDate(LocalDateTime.now());

        try{
            Material save = materialRepository.save(material);
            log.info("material added | material Id {} ", save.getId());
            return "OK";
        }catch (Exception e){
            return "save not completed" + e.getMessage();
        }

    }

    @Override
    public List<Material> getMaterialDetails() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"customer");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return materialRepository.findAll();

    }

    @Override
    public List<MaterialCategory> getMaterialCategoryList() {
        return materialCategoryRepository.findAll();
    }
}
