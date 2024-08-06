package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.dto.EmployeeStatusDto;

import java.util.List;

public interface StatusService {
    List<EmployeeStatusDto> findEmployeeStatus();
}
