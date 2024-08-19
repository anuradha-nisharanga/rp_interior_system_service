package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.GRN;
import com.bit.rp_interior_system.model.SupplierPayment;
import com.bit.rp_interior_system.model.SupplierPaymentStatus;
import com.bit.rp_interior_system.model.SupplierPaymentType;
import com.bit.rp_interior_system.service.SupplierPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/supplier-payments")
@RequiredArgsConstructor
public class SupplierPaymentController {

    private final SupplierPaymentService supplierPaymentService;

    @GetMapping("/view")
    public List<SupplierPayment> findAllPayments(){

        return supplierPaymentService.findAllSupplierPayments();
    }

    @PostMapping("/create")
    public String createPayment(@RequestBody SupplierPayment supplierPayment){

        return supplierPaymentService.createPayment(supplierPayment);
    }

    @PutMapping("/update")
    public String updatePayment(@RequestBody SupplierPayment supplierPayment){

        return supplierPaymentService.updatePayment(supplierPayment);
    }

    @DeleteMapping("/delete")
    public String deletePayment(@RequestBody SupplierPayment supplierPayment){

        return supplierPaymentService.deletePayment(supplierPayment);
    }

    @GetMapping("/status")
    public List<SupplierPaymentStatus> findAllSupplierPaymentStatus(){

        return supplierPaymentService.findAllSupplierPaymentStatus();
    }

    @GetMapping("/type")
    public List<SupplierPaymentType> findAllSupplierPaymentTypes(){

        return supplierPaymentService.findAllSupplierPaymentTypes();
    }

    @RequestMapping("/ui")
    public ModelAndView viewUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("supplierPayements.html");
        view.addObject("title", "Supplier Payments : BIT Project 2023");
        return view;
    }
}
