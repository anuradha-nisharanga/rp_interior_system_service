package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.*;
import com.bit.rp_interior_system.service.GRNService;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.SaleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleServiceImpl implements SaleService {

    private final GRNRepository grnRepository;
    private final PrivilegeService privilegeService;

    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final SaleRepository saleRepository;
    private final SaleStatusRepository saleStatusRepository;

    @Override
    public List<Sale> findAllSales() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"sale");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return saleRepository.findAll();
    }

    @Override
    public List<SaleStatus> getSaleStatus() {

        return saleStatusRepository.findAll();
    }

    @Override
    public String createSale(Sale sale) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"sale");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        try {
            sale.setCreatedUser(logedUser.getId());
            sale.setCreatedAt(LocalDateTime.now());

            //set next order code
            String nextNumber = saleRepository.getNextGrnNumber();
            if (nextNumber == null){
                nextNumber = "Order" + "0001";
            }

            sale.setOrder(nextNumber);

            for (SaleHasProduct saleHasProduct : sale.getProductList()){
                saleHasProduct.setSale(sale);

//                Optional<Material> OptionalMaterial = materialRepository.findById(grnMaterial.getMaterial().getId());
//                if (OptionalMaterial.isPresent()){
//                    Material material = OptionalMaterial.get();
//                    material.setUnitPrice(grnMaterial.getUnitPrice());
//                    log.info("material ID: {} | unit price : {}", grnMaterial.getId(), grnMaterial.getUnitPrice() );
//
//                    Integer currentQty = material.getQuantity();
//                    Integer updatedQty = currentQty + grnMaterial.getOrderQty();
//
//                    material.setQuantity(updatedQty);
//
//                    materialRepository.save(material);
//                }
            }

            saleRepository.save(sale);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }

    }

    @Override
    public String updateSale(Sale sale) {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"sale");
        if(!logUserPrivilege.get("update")){
            throw new RuntimeException("Update not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        Sale existSale = saleRepository.getReferenceById(sale.getId());
        if (existSale == null){
            return "GRN Not exist...!";
        }

        try {
            sale.setUpdatedUser(logedUser.getId());
            sale.setUpdatedAt(LocalDateTime.now());

            for (SaleHasProduct saleHasProduct : sale.getProductList()){
                saleHasProduct.setSale(sale);

//                Optional<Material> OptionalMaterial = materialRepository.findById(grnMaterial.getMaterial().getId());
//                if (OptionalMaterial.isPresent()){
//                    Material material = OptionalMaterial.get();
//                    material.setUnitPrice(grnMaterial.getUnitPrice());
//                    log.info("material ID: {} | unit price : {}", grnMaterial.getId(), grnMaterial.getUnitPrice() );
//                    materialRepository.save(material);
//                }
            }
            saleRepository.save(sale);
            return "OK";
        }
        catch (Exception e){
            return "Update not Completed" + e.getMessage();
        }
    }

    @Override
    public String deleteSale(Sale sale) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"sale");
        if(!logUserPrivilege.get("delete")){
            throw new RuntimeException("Delete not completed: you have no privilege");
        }

        Optional<Sale> optionalSale = saleRepository.findById(sale.getId());
        if (optionalSale.isEmpty()){
            throw new RuntimeException("GRN Not Found");
        }

        try{
            SaleStatus saleStatus = new SaleStatus();
            saleStatus.setId(3);
            saleStatus.setName("Deleted");

            Sale existSale = optionalSale.get();
            existSale.setSaleStatus(saleStatus);
            saleRepository.save(existSale);

            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

}
