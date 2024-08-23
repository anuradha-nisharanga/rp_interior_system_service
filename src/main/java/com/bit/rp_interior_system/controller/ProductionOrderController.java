package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.ProductionOrder;
import com.bit.rp_interior_system.model.ProductionOrderStatus;
import com.bit.rp_interior_system.service.ProductionOrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/production-order")
@RequiredArgsConstructor
public class ProductionOrderController {

    private final ProductionOrderService productionOrderService;

    @GetMapping("/view")
    public List<ProductionOrder> findAllProductionOrders(){

        return productionOrderService.findAllProductionOrders();
    }

    @PostMapping("/create")
    public String createProductionOrder(@RequestBody ProductionOrder productionOrder){

        return productionOrderService.createProductionOrder(productionOrder);
    }

    @PutMapping("/update")
    @Transactional
    public String updateProductionOrder(@RequestBody ProductionOrder productionOrder){

        return productionOrderService.updateProductionOrder(productionOrder);
    }

    @DeleteMapping("/delete")
    public String deleteProductionOrder(@RequestBody ProductionOrder productionOrder){

        return productionOrderService.deleteProductionOrder(productionOrder);
    }

    @GetMapping("/status")
    public List<ProductionOrderStatus> getProductionOrderStatus(){

        return productionOrderService.getProductionOrderStatus();
    }


    @RequestMapping("/ui")
    public ModelAndView viewUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("productionOrder.html");
        view.addObject("title", "Production Order : BIT Project 2023");
        return view;
    }
}
