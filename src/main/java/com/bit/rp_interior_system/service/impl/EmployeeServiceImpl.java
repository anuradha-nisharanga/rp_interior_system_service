package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.controller.PrivilegeController;
import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.EmployeeDto;
import com.bit.rp_interior_system.model.EmployeeStatus;
import com.bit.rp_interior_system.repository.EmployeeRepository;
import com.bit.rp_interior_system.repository.UserRepository;
import com.bit.rp_interior_system.service.EmployeeService;
import com.bit.rp_interior_system.service.PrivilegeService;
import jakarta.transaction.Transactional;
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
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PrivilegeService privilegeService;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository, UserRepository userRepository,
                               PrivilegeService privilegeService) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.privilegeService = privilegeService;
    }

    @Override
    public String createEmployee(EmployeeDto employeeDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"employee");
        if(!logUserPrivilege.get("insert")){
            return "Insert not completed: you have no privilege";
        }

        Employee employee = Employee.builder()
                .nic(employeeDto.getNic())
                .email(employeeDto.getEmail())
                .fullName(employeeDto.getFullName())
                .callingName(employeeDto.getCallingName())
                .mobile(employeeDto.getMobile())
                .landNo(employeeDto.getLandNo())
                .status(employeeDto.getStatus())
                .createdAt(LocalDateTime.now())
                .address(employeeDto.getAddress())
                .designation(employeeDto.getDesignation())
                .dateOfBirth(employeeDto.getDateOfBirth())
                .gender(employeeDto.getGender())
                .note(employeeDto.getNote())
                .civilStatus(employeeDto.getCivilStatus())
                .build();

        String employeeNo  = employeeRepository.nextEmpNo();
        employee.setEmployeeNo(employeeNo != null ? employeeNo : "E001");

//        return EmployeeDto.builder()
//                .employeeNo(employeeDto.getEmployeeNo())
//                .nic(employee.getNic())
//                .email(employeeDto.getEmail())
//                .fullName(employeeDto.getFullName())
//                .callingName(employeeDto.getCallingName())
//                .mobile(employeeDto.getMobile())
//                .landNo(employeeDto.getLandNo())
//                .build();

        // check for unique values
        try{
            Optional<Employee> empByMobile = employeeRepository.findByMobile(employeeDto.getMobile());
            if (empByMobile.isPresent()){
                return "Save not completed: insert mobile no already exist";
            }
            Optional<Employee> empByNic = employeeRepository.findByNic(employeeDto.getNic());
            if (empByNic.isPresent()){
                return "Save not completed: Insert NIC already exist";
            }
            Optional<Employee> empByEmail = employeeRepository.findByEmail(employeeDto.getEmail());
            if (empByEmail.isPresent()){
                return "Save not completed: Insert Email already exist";
            }
            employeeRepository.save(employee);
            log.info("Created Employee | Employee no {}", employee);
            return "OK";
        } catch (Exception e) {
            return "Save not completed: " + e.getMessage();
        }
    }

    @Override
    public List<Employee> getAllEmployees() {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"employee");
        if(!logUserPrivilege.get("select")){
            return null;
        }
        return employeeRepository.findAll();
    }

    @Override
    public String updateEmployee(EmployeeDto employeeDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"employee");
        if(!logUserPrivilege.get("update")){
            return "Update not completed: you have no privilege";
        }

        Optional<Employee> employeeOptional = employeeRepository.findById(employeeDto.getId());
        if (employeeOptional.isEmpty()){
            throw new RuntimeException("employee not found");
        }

        Employee employee = employeeOptional.get();
        employee.setFullName(employeeDto.getFullName());
        employee.setAddress(employeeDto.getAddress());
        employee.setStatus(employeeDto.getStatus());
        employee.setCallingName(employeeDto.getCallingName());
        employee.setMobile(employeeDto.getMobile());
        employee.setEmail(employeeDto.getEmail());
        employee.setDesignation(employeeDto.getDesignation());
//        if (employeeDto.getNic() != null && !Objects.equals(employee.getNic(), employeeDto.getNic())){
//            throw new RuntimeException("update not completed : Nic no already exist");
//        }
        try {
           employee.setLastModify(LocalDateTime.now());
           employeeRepository.save(employee);
           return "OK";
        }
        catch (Exception e){
            return "update not completed : " + e.getMessage();
        }
//        return EmployeeDto.builder()
//                .employeeNo(employeeOptional.get().getEmployeeNo())
//                .nic(employeeOptional.get().getNic())
//                .email(employeeOptional.get().getEmail())
//                .fullName(employeeDto.getFullName())
//                .callingName(employeeDto.getCallingName())
//                .mobile(employeeDto.getMobile())
//                .landNo(employeeDto.getLandNo())
//                .build();


    }
    @Transactional
    @Override
    public String deleteEmployee(EmployeeDto employeeDto) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"employee");
        if(!logUserPrivilege.get("delete")){
            return "delete not completed: you have no privilege";
        }

        Optional<Employee> employeeOptional = employeeRepository.findById(employeeDto.getId());

        if (employeeOptional.isEmpty()){
            throw new RuntimeException("employee not found");
        }
        try{
            EmployeeStatus employeeStatus = new EmployeeStatus();
            employeeStatus.setId(3);
            employeeStatus.setName("Deleted");

            Employee employee = employeeOptional.get();
            employee.setStatus(employeeStatus);
            employeeRepository.save(employee);

            // inactive User
            Optional<User> existUser = userRepository.findById(employee.getId());
            if (existUser.isPresent()){
                User user = existUser.get();
                user.setStatus(false);
            }
            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

    @Override
    public List<Employee> selectEmployeesWithoutUserAccount() {
        return employeeRepository.getEmployeeListWithoutUserAccount();
    }
}
