package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.PurchaseOrder;
import com.bit.rp_interior_system.model.PurchaseOrderStatus;
import com.bit.rp_interior_system.model.dto.MaterialDto;
import com.bit.rp_interior_system.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/purchase-order")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping("/view")
    public List<PurchaseOrder> getPurchaseOrders(){

        return purchaseOrderService.getPurchaseOrders();
    }

    @PostMapping("/create")
    public String createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder){

        return purchaseOrderService.createPurchaseOrder(purchaseOrder);
    }

    @PutMapping("/update")
    public String updatePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder){

        return purchaseOrderService.updatePurchaseOrder(purchaseOrder);
    }

    @DeleteMapping("/delete")
    public String deletePurchaseOrder(@RequestBody PurchaseOrder PurchaseOrder){

        return purchaseOrderService.deletePurchaseOrder(PurchaseOrder);
    }

    @GetMapping("/status")
    public List<PurchaseOrderStatus> getPurchaseOrderStatusList(){

        return purchaseOrderService.getPurchaseOrderStatusList();
    }

    @GetMapping("/supplier/{supId}")
    public List<PurchaseOrder> getPurchaseOrdersBySupplier(@PathVariable("supId") Integer supplierId){

        return purchaseOrderService.getPurchaseOrdersBySupplier(supplierId);
    }
    
    @RequestMapping("/ui")
    public ModelAndView materialUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("purchaseOrder.html");
        view.addObject("title", "Purchase-Order : BIT Project 2023");
        return view;
    }
}
