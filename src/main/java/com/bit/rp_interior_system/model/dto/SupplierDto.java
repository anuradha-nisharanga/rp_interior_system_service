package com.bit.rp_interior_system.model.dto;

import com.bit.rp_interior_system.model.Material;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDto {

    private Integer id;
    private String name;
    private String mobile;
    private String address;
    private String email;
    private Boolean status;
    private String note;
    private Set<Material> materials;
}
