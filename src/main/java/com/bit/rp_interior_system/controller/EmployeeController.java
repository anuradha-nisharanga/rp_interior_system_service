package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.dto.EmployeeDto;
import com.bit.rp_interior_system.service.EmployeeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

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

    @PostMapping("/create")
    @ResponseBody
    public String createEmployee(@RequestBody EmployeeDto employeeDto){

        return employeeService.createEmployee(employeeDto);
    }

    @GetMapping("/find")
    @ResponseBody
    public List<Employee> getAllEmployees(){

        return employeeService.getAllEmployees();
    }

    @PutMapping("/update")
    @ResponseBody
    public String updateEmployee(@RequestBody EmployeeDto employeeDto){

        return employeeService.updateEmployee(employeeDto);
    }

    @DeleteMapping("/delete")
    @Transactional
    public String deleteEmployee(@RequestBody EmployeeDto employeeDto){

        return employeeService.deleteEmployee(employeeDto);
    }

    @GetMapping("/without-user-account")
    @ResponseBody
    public List<Employee> selectEmployeesWithoutUserAccount(){

        return employeeService.selectEmployeesWithoutUserAccount();
    }

    //get the employee UI
    @RequestMapping("/ui")
    public ModelAndView employeeUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewEmployee= new ModelAndView();
        //get login user name
        viewEmployee.addObject("loggedUser", auth.getName());
        viewEmployee.setViewName("employee.html");
        viewEmployee.addObject("title", "Employee : BIT Project 2023");
        return viewEmployee;
    }
}
