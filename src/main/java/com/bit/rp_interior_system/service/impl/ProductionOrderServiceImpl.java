package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.*;
import com.bit.rp_interior_system.service.GRNService;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.ProductionOrderService;
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
public class ProductionOrderServiceImpl implements ProductionOrderService {

    private final GRNRepository grnRepository;
    private final PrivilegeService privilegeService;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final ProductionOrderRepository productionOrderRepository;
    private final ProductionOrderStatusRepository productionOrderStatusRepository;
    @Override
    public List<ProductionOrder> findAllProductionOrders() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"production-order");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return productionOrderRepository.findAll();
    }

    @Override
    public List<ProductionOrderStatus> getProductionOrderStatus() {

        return productionOrderStatusRepository.findAll();
    }

    @Override
    public String createProductionOrder(ProductionOrder productionOrder) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"production-order");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        try {
            productionOrder.setCreatedUser(logedUser.getId());
            productionOrder.setCreatedAt(LocalDateTime.now());

            //set next order code
            String nextNumber = productionOrderRepository.getNextProdOrderNumber();
            if (nextNumber == null){
                nextNumber = "ORDER" + "0001";
            }

            productionOrder.setCode(nextNumber);

            for (ProductionOrderHasProduct productionOrderHasProduct : productionOrder.getProdOrderProductList()){
                /*set initially zero*/
                productionOrderHasProduct.setCompletedQty(0);
                productionOrderHasProduct.setProductionOrder(productionOrder);
            }

            for (ProductionOrderHasMaterial productionOrderHasMaterial : productionOrder.getProdOrderMaterialtList()){
                productionOrderHasMaterial.setProductionOrder(productionOrder);
            }

            productionOrderRepository.save(productionOrder);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }

    }

    @Override
    public String updateProductionOrder(ProductionOrder productionOrder) {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"production-order");
        if(!logUserPrivilege.get("update")){
            throw new RuntimeException("Update not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        ProductionOrder existProductionOrder = productionOrderRepository.getReferenceById(productionOrder.getId());
        if (existProductionOrder == null){
            return "GRN Not exist...!";
        }

        try {
            productionOrder.setUpdatedUser(logedUser.getId());
            productionOrder.setUpdatedAt(LocalDateTime.now());

            for (ProductionOrderHasProduct productionOrderHasProduct : productionOrder.getProdOrderProductList()){
                productionOrderHasProduct.setProductionOrder(productionOrder);

//                Optional<Material> OptionalMaterial = materialRepository.findById(grnMaterial.getMaterial().getId());
//                if (OptionalMaterial.isPresent()){
//                    Material material = OptionalMaterial.get();
//                    material.setUnitPrice(grnMaterial.getUnitPrice());
//                    log.info("material ID: {} | unit price : {}", grnMaterial.getId(), grnMaterial.getUnitPrice() );
//                    materialRepository.save(material);
//                }
            }
            productionOrderRepository.save(productionOrder);
            return "OK";
        }
        catch (Exception e){
            return "Update not Completed" + e.getMessage();
        }
    }

    @Override
    public String deleteProductionOrder(ProductionOrder productionOrder) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"production-order");
        if(!logUserPrivilege.get("delete")){
            throw new RuntimeException("Delete not completed: you have no privilege");
        }

        Optional<ProductionOrder> optionalProductionOrder = productionOrderRepository.findById(productionOrder.getId());
        if (optionalProductionOrder.isEmpty()){
            throw new RuntimeException("GRN Not Found");
        }

        try{
            ProductionOrderStatus productionOrderStatus = new ProductionOrderStatus();
            productionOrderStatus.setId(3);
            productionOrderStatus.setName("Deleted");

            ProductionOrder existProductionOrder = optionalProductionOrder.get();
            existProductionOrder.setProductionOrderStatus(productionOrderStatus);
            productionOrderRepository.save(existProductionOrder);

            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

}
