package com.bit.rp_interior_system.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {

    private String employeeNo;
    private String nic;
    private String email;
    private String fullName;
    private String callingName;
    private String mobile;
    private String landNo;
    private String address;
    private String note;
    private EmployeeStatus employeeStatus;
    private Designation designation;
}
