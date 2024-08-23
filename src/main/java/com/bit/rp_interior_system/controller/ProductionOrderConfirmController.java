package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.ProductionOrder;
import com.bit.rp_interior_system.service.ProductionOrderConfirmService;
import com.bit.rp_interior_system.service.ProductionOrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/production-order-confirmation")
@RequiredArgsConstructor
@Slf4j
public class ProductionOrderConfirmController {

    private final ProductionOrderConfirmService productionOrderConfirmService;
    @Transactional
    @PutMapping("/update")
    public String updateProductionOrder(@RequestBody ProductionOrder productionOrder){
        log.info("update production order confirm controller");
        return productionOrderConfirmService.updateProductionOrderConfirmation(productionOrder);
    }

    @RequestMapping("/ui")
    public ModelAndView viewUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("productionOrderConfirmation.html");
        view.addObject("title", "Order Confirmation : BIT Project 2023");
        return view;
    }
}
