package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.MaterialRepository;
import com.bit.rp_interior_system.repository.ProductionOrderRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.ProductionOrderConfirmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductionOrderConfirmServiceImpl implements ProductionOrderConfirmService {

    private final PrivilegeService privilegeService;
    private final UserRepository userRepository;
    private final ProductionOrderRepository productionOrderRepository;
    private final MaterialRepository materialRepository;

    @Override
    public String updateProductionOrderConfirmation(ProductionOrder productionOrder) {
        log.info("update production order confirm service calling");

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"production-order");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        // check exisiting and duplicate
        ProductionOrder extProductionOrder = productionOrderRepository.getReferenceById(productionOrder.getId());
        if (extProductionOrder == null) {
            return "Production Order update not completed: Production Order doesn't exist";
        }

        try {

            // need to down the inventoty
            if (productionOrder.getProductionOrderStatus().getId() == 3) {

                // set updated date
                productionOrder.setUpdatedAt(LocalDateTime.now());
            }

            // inner list eke thyena object ekakata one by one by main object eka set kra
            for (ProductionOrderHasProduct productionOrderHasProduct : productionOrder.getProdOrderProductList()){
                productionOrderHasProduct.setProductionOrder(productionOrder);
            }

            // inner list eke thyena object ekakata one by one by main object eka set kra
            for (ProductionOrderHasMaterial productionOrderHasMaterial : productionOrder.getProdOrderMaterialtList()){
                productionOrderHasMaterial.setProductionOrder(productionOrder);
            }

            // operator

            ProductionOrder savedProOrder = productionOrderRepository.save(productionOrder);
            log.info("saved production order status : {}", savedProOrder.getProductionOrderStatus().getName());
            // dependancies

            // need to down the inventoty
            if (savedProOrder.getProductionOrderStatus().getId() == 3) {


                log.info("coming to id statement");
                log.info("coming list : {}", productionOrder.getProdOrderMaterialtList());

                for (ProductionOrderHasMaterial productionOrderHasMaterial : productionOrder.getProdOrderMaterialtList()) {
                    Material material = materialRepository.getReferenceById(productionOrderHasMaterial.getMaterial().getId());
                    log.info("material");

                    Integer exMaterialStock = material.getQuantity();
                    material.setQuantity(exMaterialStock - productionOrderHasMaterial.getRequiredQty() );

                    log.info("material qtys : existQty {} | requiredQty {}",exMaterialStock, productionOrderHasMaterial.getRequiredQty());

                    log.info("new quantity : {}", material.getQuantity() );
                    // save material stock dao
                    materialRepository.save(material);
                }

            }

            return "OK";
        } catch (Exception e) {
            return "Update not completed : " + e.getMessage();
        }
    }
}
