package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.EmployeeDto;
import com.bit.rp_interior_system.repository.EmployeeRepository;
import com.bit.rp_interior_system.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository){
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeDto createEmployee() {
        return null;
    }
}
