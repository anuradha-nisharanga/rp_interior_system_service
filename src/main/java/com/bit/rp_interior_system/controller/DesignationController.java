package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.dto.DesignationDto;
import com.bit.rp_interior_system.service.DesignationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/designation/")
public class DesignationController {

    private final DesignationService designationService;
    @Autowired
    public DesignationController (DesignationService designationService){
        this.designationService = designationService;
    }

    @GetMapping("")
    @ResponseBody
    public List<DesignationDto> findDesignation(){
        return designationService.findDesignation();
    }
}
