package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.dto.EmployeeStatusDto;
import com.bit.rp_interior_system.service.DesignationService;
import com.bit.rp_interior_system.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/status/")
public class StatusController {

    private final StatusService statusService;

    @Autowired
    public StatusController (StatusService statusService){
        this.statusService = statusService;
    }

    @GetMapping("")
    @ResponseBody
    public List<EmployeeStatusDto> findEmployeeStatus(){
        return statusService.findEmployeeStatus();
    }




}
