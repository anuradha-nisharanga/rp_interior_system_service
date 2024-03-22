package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.EmployeeDto;
import com.bit.rp_interior_system.model.EmployeeStatus;
import com.bit.rp_interior_system.repository.EmployeeRepository;
import com.bit.rp_interior_system.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository){
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        log.info("employee",employeeDto);
        Employee employee = Employee.builder()
                .employeeNo(employeeDto.getEmployeeNo())
                .nic(employeeDto.getNic())
                .email(employeeDto.getEmail())
                .fullName(employeeDto.getFullName())
                .callingName(employeeDto.getCallingName())
                .mobile(employeeDto.getMobile())
                .landNo(employeeDto.getLandNo())
                .employeeStatus(employeeDto.getEmployeeStatus())
                .designation(employeeDto.getDesignation())
                .build();

        employeeRepository.save(employee);

        return EmployeeDto.builder()
                .employeeNo(employeeDto.getEmployeeNo())
                .nic(employee.getNic())
                .email(employeeDto.getEmail())
                .fullName(employeeDto.getFullName())
                .callingName(employeeDto.getCallingName())
                .mobile(employeeDto.getMobile())
                .landNo(employeeDto.getLandNo())
                .build();
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public EmployeeDto updateEmployee(Integer id, EmployeeDto employeeDto) {

        Optional<Employee> employeeOptional = employeeRepository.findById(id);

        if (employeeOptional.isEmpty()){
            throw new RuntimeException("id not found");
        }

        Employee employee = employeeOptional.get();
        employee.setFullName(employeeDto.getFullName());
        employee.setAddress(employeeDto.getAddress());
        employeeRepository.save(employee);

        return EmployeeDto.builder()
                .employeeNo(employeeOptional.get().getEmployeeNo())
                .nic(employeeOptional.get().getNic())
                .email(employeeOptional.get().getEmail())
                .fullName(employeeDto.getFullName())
                .callingName(employeeDto.getCallingName())
                .mobile(employeeDto.getMobile())
                .landNo(employeeDto.getLandNo())
                .build();
    }

    @Override
    public void deleteEmployee(Integer id) {

        Optional<Employee> employeeOptional = employeeRepository.findById(id);

        if (employeeOptional.isEmpty()){
            throw new RuntimeException("id not found");
        }

        EmployeeStatus employeeStatus = new EmployeeStatus();
        employeeStatus.setId(3);
        employeeStatus.setName("Deleted");

        Employee employee = employeeOptional.get();
        employee.setEmployeeStatus(employeeStatus);
        employeeRepository.save(employee);

    }
}
