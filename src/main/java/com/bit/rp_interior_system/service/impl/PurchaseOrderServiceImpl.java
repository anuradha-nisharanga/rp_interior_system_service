package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.PurchaseOrder;
import com.bit.rp_interior_system.model.PurchaseOrderStatus;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.repository.PurchaseOrderRepository;
import com.bit.rp_interior_system.repository.PurchaseOrderStatusRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PrivilegeService privilegeService;
    private final PurchaseOrderStatusRepository purchaseOrderStatusRepository;
    private final UserRepository userRepository;

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

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }
    }
}
