package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.GRNRepository;
import com.bit.rp_interior_system.repository.GRNStatusRepository;
import com.bit.rp_interior_system.repository.MaterialRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.GRNService;
import com.bit.rp_interior_system.service.PrivilegeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GRNServiceImpl implements GRNService {

    private final GRNRepository grnRepository;
    private final PrivilegeService privilegeService;
    private final GRNStatusRepository grnStatusRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    @Override
    public List<GRN> findAllGrn() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"grn");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return grnRepository.findAll();
    }

    @Override
    public List<GrnStatus> getGRNStatusList() {

        return grnStatusRepository.findAll();
    }

    @Override
    public String createGrn(GRN grn) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"grn");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        try {
            grn.setCreatedUser(logedUser.getId());
            grn.setCreatedAt(LocalDateTime.now());

            //set next order code
            String nextNumber = grnRepository.getNextGrnNumber();
            if (nextNumber == null){
                nextNumber = "GRN" + "000001";
            }

            grn.setGrnCode(nextNumber);

            for (GRNHasMaterial grnMaterial : grn.getGrnMaterialList()){
                grnMaterial.setGrn(grn);

                Optional<Material> OptionalMaterial = materialRepository.findById(grnMaterial.getMaterial().getId());
                if (OptionalMaterial.isPresent()){
                    Material material = OptionalMaterial.get();
                    material.setUnitPrice(grnMaterial.getUnitPrice());
                    log.info("material ID: {} | unit price : {}", grnMaterial.getId(), grnMaterial.getUnitPrice() );
                    materialRepository.save(material);
                }
            }
            grnRepository.save(grn);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }

    }

    @Override
    public String updateGrn(GRN grn) {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"grn");
        if(!logUserPrivilege.get("update")){
            throw new RuntimeException("Update not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        GRN existGrn = grnRepository.getReferenceById(grn.getId());
        if (existGrn == null){
            return "GRN Not exist...!";
        }

        try {
            grn.setUpdatedUser(logedUser.getId());
            grn.setUpdatedAt(LocalDateTime.now());

            for (GRNHasMaterial grnMaterial : grn.getGrnMaterialList()){
                grnMaterial.setGrn(grn);

                Optional<Material> OptionalMaterial = materialRepository.findById(grnMaterial.getMaterial().getId());
                if (OptionalMaterial.isPresent()){
                    Material material = OptionalMaterial.get();
                    material.setUnitPrice(grnMaterial.getUnitPrice());
                    log.info("material ID: {} | unit price : {}", grnMaterial.getId(), grnMaterial.getUnitPrice() );
                    materialRepository.save(material);
                }

            }
            grnRepository.save(grn);

            return "OK";
        }
        catch (Exception e){
            return "Update not Completed" + e.getMessage();
        }
    }

    @Override
    public String deleteDrn(GRN grn) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"grn");
        if(!logUserPrivilege.get("delete")){
            throw new RuntimeException("Delete not completed: you have no privilege");
        }

        Optional<GRN> optionalGRN = grnRepository.findById(grn.getId());
        if (optionalGRN.isEmpty()){
            throw new RuntimeException("GRN Not Found");
        }

        try{
            GrnStatus grnStatus = new GrnStatus();
            grnStatus.setId(3);
            grnStatus.setName("Deleted");

            GRN existGRN = optionalGRN.get();
            existGRN.setGrnStatus(grnStatus);
            grnRepository.save(existGRN);

            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }
}
