package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.EmployeeDto;

import java.util.List;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeDto employeeDto);

    List<Employee> getAllEmployees();

    EmployeeDto updateEmployee(Integer id,EmployeeDto employeeDto);

    void deleteEmployee(Integer id);
}
