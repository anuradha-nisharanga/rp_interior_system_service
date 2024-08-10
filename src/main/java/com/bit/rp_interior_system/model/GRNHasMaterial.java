package com.bit.rp_interior_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "grn_has_material")
public class GRNHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "unit_price")
    @NotNull
    private BigDecimal unitPrice;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "line_price")
    @NotNull
    private BigDecimal linePrice;

    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @JsonIgnore
    private GRN grn;

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material;

}
