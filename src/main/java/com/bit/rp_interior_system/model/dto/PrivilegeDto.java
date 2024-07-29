package com.bit.rp_interior_system.model.dto;

import com.bit.rp_interior_system.model.Module;
import com.bit.rp_interior_system.model.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivilegeDto {

    private Integer id;
    private Boolean view;
    private Boolean create;
    private Boolean edit;
    private Boolean remove;
    private Role role;
    private Module module;
}
