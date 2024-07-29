package com.bit.rp_interior_system.model.dto;

import com.bit.rp_interior_system.model.MaterialCategory;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDto {

    private String name;
    private String code;
    private String description;
    private String image;
    private Integer quantity;
    private BigDecimal unitPrice;
    private Integer reorderPoint;
    private Boolean status;
    private MaterialCategory materialCategory;
}
