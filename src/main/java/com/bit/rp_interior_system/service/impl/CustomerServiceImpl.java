package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Customer;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.CustomerDto;
import com.bit.rp_interior_system.repository.CustomerRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.CustomerService;
import com.bit.rp_interior_system.service.PrivilegeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PrivilegeService privilegeService;
    private final UserRepository userRepository;
    @Autowired
    public CustomerServiceImpl(CustomerRepository customerRepository,
                               PrivilegeService privilegeService,
                               UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.privilegeService = privilegeService;
        this.userRepository = userRepository;
    }

    @Override
    public String createCustomer(CustomerDto customerDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"customer");
        if(!logUserPrivilege.get("insert")){
            return "Insert not completed: you have no privilege";
        }

        Customer customer = Customer.builder()
                .name(customerDto.getName())
                .address(customerDto.getAddress())
                .email(customerDto.getEmail())
                .nic(customerDto.getNic())
                .status(customerDto.getStatus())
                .note(customerDto.getNote())
                .createdDate(LocalDateTime.now())
                .mobile(customerDto.getMobile())
                .build();

        String nextCustomerNo = customerRepository.nextCustomerNo();
        customer.setCode(nextCustomerNo != null ? nextCustomerNo : "C00001");

        //set log user value
        User logedUser = userRepository.getUserByUserName(auth.getName());
        customer.setCreatedUser(logedUser);
        customer.setCreatedDate(LocalDateTime.now());


        try {
            customerRepository.save(customer);
            log.info("Customer Created | Customer Name {}", customer.getName());
            return "OK";
        }
        catch (Exception e){
            return "Save not completed: " + e.getMessage();
        }
    }

    @Override
    public List<Customer> getAllCustomers() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"customer");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return customerRepository.findAll();

    }

    @Override
    public String updateCustomer(CustomerDto customerDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"customer");
        if(!logUserPrivilege.get("update")){
            return "update not completed : you have no privilege";
        }

        Optional<Customer> customerById = customerRepository.findById(customerDto.getId());
        if(customerById.isEmpty()){
            throw new RuntimeException("Invalid Customer");
        }
        Customer customer = customerById.get();
        customer.setName(customerDto.getName());
        customer.setMobile(customerDto.getMobile());
        customer.setEmail(customerDto.getEmail());
        customer.setAddress(customerDto.getAddress());
        customer.setNote(customerDto.getNote());
        customer.setNic(customerDto.getNic());
        customer.setStatus(customerDto.getStatus());
        User logedUser = userRepository.getUserByUserName(auth.getName());

        try {
            customer.setUpdatedUser(logedUser.getId());
            customer.setLastModifyDate(LocalDateTime.now());
            customerRepository.save(customer);
            return "OK";
        }
        catch (Exception e){
            return "Update no completed" + e.getMessage();
        }
    }

    @Override
    public String deleteCustomer(CustomerDto customerDto) {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"customer");
        if(!logUserPrivilege.get("delete")){
            return "Delete not completed : you have no privilege";
        }

        Optional<Customer> customerById = customerRepository.findById(customerDto.getId());
        if (customerById.isEmpty()){
            throw new RuntimeException("Customer not found");
        }
        Customer customer = customerById.get();
        customer.setStatus(false);
        User logedUser = userRepository.getUserByUserName(auth.getName());
        try {
            customer.setDeletedUser(logedUser.getId());
            customer.setDeletedDate(LocalDateTime.now());
            customerRepository.save(customer);
            return "OK";
        }
        catch (Exception e){
            return "Update no completed" + e.getMessage();
        }

    }
}
