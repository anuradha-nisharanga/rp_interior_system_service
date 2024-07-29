package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.dto.DesignationDto;

import java.util.List;

public interface DesignationService {
    List<DesignationDto> findDesignation();
}
