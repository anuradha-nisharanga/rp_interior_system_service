package com.bit.rp_interior_system.model.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStatusDto {

    private Integer id;
    private String statusName;
}
