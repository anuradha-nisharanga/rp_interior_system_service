package com.bit.rp_interior_system.model.dto;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

    private Integer id;
    private String name;
    private String code;
    private String mobile;
    private String nic;
    private String email;
    private String address;
    private Boolean status;
    private String note;
}
