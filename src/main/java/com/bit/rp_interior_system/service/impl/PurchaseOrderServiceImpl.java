package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.MaterialRepository;
import com.bit.rp_interior_system.repository.PurchaseOrderRepository;
import com.bit.rp_interior_system.repository.PurchaseOrderStatusRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.PurchaseOrderService;
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
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PrivilegeService privilegeService;
    private final PurchaseOrderStatusRepository purchaseOrderStatusRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;

    @Override
    public List<PurchaseOrder> getPurchaseOrders() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"purchase-order");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return purchaseOrderRepository.findAll();
    }

    @Override
    public List<PurchaseOrderStatus> getPurchaseOrderStatusList() {

        return purchaseOrderStatusRepository.findAll();
    }

    @Override
    public String createPurchaseOrder(PurchaseOrder purchaseOrder) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"purchase-order");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());


        try {
            purchaseOrder.setCreatedUser(logedUser.getId());
            purchaseOrder.setCreatedAt(LocalDateTime.now());

            //set next order code
            String nextNumber = purchaseOrderRepository.getNextNumber();
            if (nextNumber == null){
                nextNumber = LocalDate.now().getYear() + "000001";
            }

            purchaseOrder.setPurchaseOrderCode(nextNumber);

            for (PurchaseOrderHasMaterial pOrderMaterial : purchaseOrder.getMaterialList()){
                pOrderMaterial.setPurchaseOrder(purchaseOrder);

                Optional<Material> OptionalMaterial = materialRepository.findById(pOrderMaterial.getMaterial().getId());
                if (OptionalMaterial.isPresent()){
                    Material material = OptionalMaterial.get();
                    material.setUnitPrice(pOrderMaterial.getUnitPrice());
                    log.info("material ID: {} | unit price : {}", pOrderMaterial.getId(), pOrderMaterial.getUnitPrice() );
                    materialRepository.save(material);
                }
            }
            purchaseOrderRepository.save(purchaseOrder);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }
    }

    @Override
    public String updatePurchaseOrder(PurchaseOrder purchaseOrder) {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"purchase-order");
        if(!logUserPrivilege.get("update")){
            throw new RuntimeException("Update not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        PurchaseOrder existPurchaseOrder = purchaseOrderRepository.getReferenceById(purchaseOrder.getId());
        if (existPurchaseOrder == null){
            return "Purchase Order Not exist...!";
        }

        try {
            purchaseOrder.setUpdatedUser(logedUser.getId());
            purchaseOrder.setUpdatedAt(LocalDateTime.now());

            for (PurchaseOrderHasMaterial pOrderMaterial : purchaseOrder.getMaterialList()){
                pOrderMaterial.setPurchaseOrder(purchaseOrder);

                Optional<Material> OptionalMaterial = materialRepository.findById(pOrderMaterial.getMaterial().getId());
                if (OptionalMaterial.isPresent()){
                    Material material = OptionalMaterial.get();
                    material.setUnitPrice(pOrderMaterial.getUnitPrice());
                    log.info("material ID: {} | unit price : {}", pOrderMaterial.getId(), pOrderMaterial.getUnitPrice() );
                    materialRepository.save(material);
                }
            }
            purchaseOrderRepository.save(purchaseOrder);

            return "OK";
        }
        catch (Exception e){
            return "Update not Completed" + e.getMessage();
        }
    }

    @Override
    public String deletePurchaseOrder(PurchaseOrder purchaseOrder) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"purchase-order");
        if(!logUserPrivilege.get("delete")){
            throw new RuntimeException("Delete not completed: you have no privilege");
        }

        Optional<PurchaseOrder> optionalPurchaseOrder = purchaseOrderRepository.findById(purchaseOrder.getId());
        if (optionalPurchaseOrder.isEmpty()){
            throw new RuntimeException("Purchase Order Not Found");
        }

        try{
            PurchaseOrderStatus purchaseOrderStatus = new PurchaseOrderStatus();
            purchaseOrderStatus.setId(4);
            purchaseOrderStatus.setName("Deleted");

            PurchaseOrder existOrder = optionalPurchaseOrder.get();
            existOrder.setPurchaseOrderStatus(purchaseOrderStatus);
            purchaseOrderRepository.save(existOrder);

            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }

    }

    @Override
    public List<PurchaseOrder> getPurchaseOrdersBySupplier(Integer supplierId) {

        return purchaseOrderRepository.getPurchaseOrdersBySupplier(supplierId);
    }
}
