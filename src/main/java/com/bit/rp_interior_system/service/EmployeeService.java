package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.dto.EmployeeDto;

import java.util.List;

public interface EmployeeService {
    String createEmployee(EmployeeDto employeeDto);

    List<Employee> getAllEmployees();

    String updateEmployee(EmployeeDto employeeDto);

    String deleteEmployee(EmployeeDto employeeDto);

    List<Employee> selectEmployeesWithoutUserAccount();
}
