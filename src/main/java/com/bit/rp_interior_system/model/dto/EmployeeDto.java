package com.bit.rp_interior_system.model.dto;

import com.bit.rp_interior_system.model.Designation;
import com.bit.rp_interior_system.model.EmployeeStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {

    private Integer id;
    private String employeeNo;
    private String nic;
    private String email;
    private String fullName;
    private String callingName;
    private String mobile;
    private String landNo;
    private String address;
    private String note;
    private EmployeeStatus status;
    private Designation designation;
    private LocalDate dateOfBirth;
    private String gender;
    private String civilStatus;
}
