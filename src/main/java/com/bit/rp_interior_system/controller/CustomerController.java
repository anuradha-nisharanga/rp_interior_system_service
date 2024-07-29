package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Customer;
import com.bit.rp_interior_system.model.dto.CustomerDto;
import com.bit.rp_interior_system.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/customer")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController (CustomerService customerService){
        this.customerService = customerService;
    }

    @PostMapping("/create")
    @ResponseBody
    public String createCustomer(@RequestBody CustomerDto customerDto){
        return customerService.createCustomer(customerDto);
    }

    @GetMapping("/find")
    @ResponseBody
    public List<Customer> getAllCustomers(){
        return customerService.getAllCustomers();
    }

    @PutMapping("/update")
    @ResponseBody
    public String updateCustomer(@RequestBody CustomerDto customerDto){
        return customerService.updateCustomer(customerDto);
    }

    @DeleteMapping("/delete")
    @ResponseBody
    public String deleteCustomer(@RequestBody CustomerDto customerDto){
        return customerService.deleteCustomer(customerDto);
    }


    @RequestMapping("/ui")
    public ModelAndView CustomerUI(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView viewUser= new ModelAndView();
        //get login user name
        viewUser.addObject("loggedUser", auth.getName());
        viewUser.setViewName("customer.html");
        viewUser.addObject("title", "Customer : BIT Project 2023");
        return viewUser;
    }

}
