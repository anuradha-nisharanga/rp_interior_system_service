package com.bit.rp_interior_system.model.dto;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.Role;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Integer id;
    private String username;
    private String password;
    private String email;
    private String imageUrl;
    private Boolean status;
    private String note;
    private Employee employee;
    private Set<Role> roles;
}
