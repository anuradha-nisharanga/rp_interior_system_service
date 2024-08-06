package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Supplier;
import com.bit.rp_interior_system.model.dto.SupplierDto;
import com.bit.rp_interior_system.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping("/view")
    public List<Supplier> getSupplierList(){
        return supplierService.getSupplierList();
    }

    @PostMapping("/create")
    public String createSupplier(@RequestBody SupplierDto supplierDto){
        return supplierService.createSupplier(supplierDto);
    }

    @PutMapping("/update")
    public String updateSupplier(@RequestBody SupplierDto supplierDto){
        return supplierService.updateSupplier(supplierDto);
    }

    @DeleteMapping("/delete")
    public String deleteSupplier(@RequestBody SupplierDto supplierDto){
        return supplierService.deleteSupplier(supplierDto);
    }

    @RequestMapping("/ui")
    public ModelAndView materialUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view = new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("supplier.html");
        view.addObject("title", "Supplier : BIT Project 2023");
        return view;
    }
}
