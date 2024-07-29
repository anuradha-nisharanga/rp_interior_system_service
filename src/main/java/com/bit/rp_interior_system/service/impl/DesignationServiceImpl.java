package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.Designation;
import com.bit.rp_interior_system.model.dto.DesignationDto;
import com.bit.rp_interior_system.repository.DesignationRepository;
import com.bit.rp_interior_system.service.DesignationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;

    @Autowired
    public DesignationServiceImpl(DesignationRepository designationRepository){
       this.designationRepository = designationRepository;
    }
    @Override
    public List<DesignationDto> findDesignation() {
        List<Designation> designationList = designationRepository.findAll();
        List<DesignationDto> designationDtoList = new ArrayList<>();
        
        for (Designation designation : designationList){
            DesignationDto designationDto = DesignationDto.builder()
                    .id(designation.getId())
                    .designationName(designation.getName())
                    .build();
            designationDtoList.add(designationDto);
        }

        return designationDtoList;
    }
}
