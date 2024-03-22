package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.EmployeeDto;
import com.bit.rp_interior_system.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController( EmployeeService employeeService){
        this.employeeService = employeeService;
    }
    @PostMapping("/")
    @ResponseBody
    public EmployeeDto createEmployee(@RequestBody EmployeeDto employeeDto){
        return employeeService.createEmployee(employeeDto);
    }

    @GetMapping("/")
    @ResponseBody
    public List<Employee> getAllEmployees(){
        return employeeService.getAllEmployees();
    }
    @PutMapping("/{id}")
    @ResponseBody
    public EmployeeDto updateEmployee(@PathVariable("id") Integer id, @RequestBody EmployeeDto employeeDto){
        return employeeService.updateEmployee(id, employeeDto);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable("id") Integer id){
        employeeService.deleteEmployee(id);
    }


}
