package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Customer;
import com.bit.rp_interior_system.model.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    String createCustomer(CustomerDto customerDto);

    List<Customer> getAllCustomers();

    String updateCustomer(CustomerDto customerDto);

    String deleteCustomer(CustomerDto customerDto);
}
