package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Supplier;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.SupplierDto;
import com.bit.rp_interior_system.repository.SupplierRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.SupplierService;
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
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final PrivilegeService privilegeService;
    private final UserRepository userRepository;

    @Override
    public List<Supplier> getAllSuppliers() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return supplierRepository.findAll();
    }

    @Override
    public String createSupplier(SupplierDto supplierDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier");
        if(!logUserPrivilege.get("insert")){
            return null;
        }

        Supplier supplier = Supplier.builder()
                .name(supplierDto.getName())
                .email(supplierDto.getEmail())
                .address(supplierDto.getAddress())
                .mobile(supplierDto.getMobile())
                .status(supplierDto.getStatus())
                .note(supplierDto.getNote())
                .materials(supplierDto.getMaterials())
                .build();

        //set log user value
        User logedUser = userRepository.getUserByUserName(auth.getName());
        supplier.setCreatedUser(logedUser);
        supplier.setCreatedAt(LocalDateTime.now());

        try{
            Supplier save = supplierRepository.save(supplier);
            log.info("material added | material Id {} ", save.getId());
            return "OK";
        }catch (Exception e){
            return "save not completed" + e.getMessage();
        }
    }

    @Override
    public String updateSupplier(SupplierDto supplierDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier");
        if(!logUserPrivilege.get("update")){
            return null;
        }

        Optional<Supplier> supplierOptional = supplierRepository.findById(supplierDto.getId());
        if (supplierOptional.isEmpty()){
            throw new RuntimeException("Supplier Not Found");
        }

        Supplier supplier = supplierOptional.get();
        supplier.setName(supplierDto.getName());
        supplier.setAddress(supplierDto.getAddress());
        supplier.setMobile(supplierDto.getMobile());
        supplier.setEmail(supplierDto.getEmail());

        User logedUser = userRepository.getUserByUserName(auth.getName());
        supplier.setUpdatedUser(logedUser.getId());

        try {
            supplierRepository.save(supplier);
            return "OK";
        }
        catch (Exception e){
            return "update not completed : " + e.getMessage();
        }
    }

    @Override
    public String deleteSupplier(SupplierDto supplierDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier");
        if(!logUserPrivilege.get("delete")){
            return null;
        }

        Optional<Supplier> supplierOptional = supplierRepository.findById(supplierDto.getId());
        if (supplierOptional.isEmpty()){
            throw new RuntimeException("Supplier Not Found");
        }

        try {
            Supplier supplier = supplierOptional.get();
            supplier.setStatus(false);
            supplierRepository.save(supplier);
            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

    @Override
    public List<Supplier> getSupplierList() {

        return supplierRepository.list();
    }
}
