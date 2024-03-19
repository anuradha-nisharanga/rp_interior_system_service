package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.EmployeeDto;
import com.bit.rp_interior_system.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController( EmployeeService employeeService){
        this.employeeService = employeeService;
    }

    @ResponseBody
    public EmployeeDto createEmployee(){
        return employeeService.createEmployee();
    }
}
