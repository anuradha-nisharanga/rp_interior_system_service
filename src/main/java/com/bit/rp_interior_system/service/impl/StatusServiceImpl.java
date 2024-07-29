package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.EmployeeStatus;
import com.bit.rp_interior_system.model.dto.EmployeeStatusDto;
import com.bit.rp_interior_system.repository.EmployeeStatusRepository;
import com.bit.rp_interior_system.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatusServiceImpl implements StatusService {

    private final EmployeeStatusRepository employeeStatusRepository;

    @Autowired
    public StatusServiceImpl(EmployeeStatusRepository employeeStatusRepository){
        this.employeeStatusRepository = employeeStatusRepository;
    }

    @Override
    public List<EmployeeStatusDto> findEmployeeStatus() {
        List<EmployeeStatus> employeeStatusList = employeeStatusRepository.findAll();
        List<EmployeeStatusDto> employeeStatusDtoList = new ArrayList<>();

        for (EmployeeStatus employeeStatus : employeeStatusList){
            EmployeeStatusDto employeeStatusDto = EmployeeStatusDto.builder()
                    .id(employeeStatus.getId())
                    .statusName(employeeStatus.getName())
                    .build();
            employeeStatusDtoList.add(employeeStatusDto);
        }

        return employeeStatusDtoList;
    }
}
