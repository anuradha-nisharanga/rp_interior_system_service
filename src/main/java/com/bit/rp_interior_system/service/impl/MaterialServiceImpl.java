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
import java.util.Optional;

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
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        Material material = Material.builder()
                .name(materialDto.getName())
                .description(materialDto.getDescription())
                .image(materialDto.getImage())
                .createdDate(LocalDateTime.now())
                .quantity(materialDto.getQuantity())
                .note(materialDto.getNote())
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
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return materialRepository.findAll();

    }

    @Override
    public String updateMaterial(MaterialDto materialDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("update")){
            return null;
        }

        Optional<Material> materialOptional = materialRepository.findById(materialDto.getId());
        if (materialOptional.isEmpty()){
            throw new RuntimeException("Material not found");
        }

        Material material = materialOptional.get();
        material.setName(materialDto.getName());
        material.setMaterialCategory(materialDto.getMaterialCategory());
        material.setUnitPrice(materialDto.getUnitPrice());
        material.setNote(materialDto.getNote());
        material.setQuantity(materialDto.getQuantity());

        User logedUser = userRepository.getUserByUserName(auth.getName());
        material.setUpdatedUser(logedUser.getId());
        try {
           materialRepository.save(material);
            return "OK";
        }
        catch (Exception e){
            return "update not completed : " + e.getMessage();
        }
    }

    @Override
    public String deleteMaterial(MaterialDto materialDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("delete")){
            return null;
        }

        Optional<Material> optionalMaterial = materialRepository.findById(materialDto.getId());
        if (optionalMaterial.isEmpty()){
            throw new RuntimeException("Material Not Found");
        }

        try {
            Material material = optionalMaterial.get();
            material.setStatus(false);
            materialRepository.save(material);
            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

    @Override
    public List<Material> getAvailableMaterial() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return materialRepository.getAvailableMaterialList();
    }

    @Override
    public List<Material> getSupplierNotProvideMaterials(Integer supplierId) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return materialRepository.getSupplierNotProvideMaterials(supplierId);
    }

    @Override
    public List<Material> getSupplierProvideMaterials(Integer supplierId) {

        return materialRepository.getSupplierProvideMaterials(supplierId);
    }

    @Override
    public List<Material> getMaterialsByPurchaseOrder(Integer purchaseOrderId) {

        return materialRepository.getMaterialListByPurchaseOrder(purchaseOrderId);
    }

    @Override
    public List<MaterialCategory> getMaterialCategoryList() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"material");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return materialCategoryRepository.findAll();
    }


}
