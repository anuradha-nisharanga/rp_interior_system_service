package com.bit.rp_interior_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "production_order_has_material")
public class ProductionOrderHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "required_qty")
    @NotNull
    private Integer requiredQty; // required material qty for production check required qty

    @Column(name = "available_qty")
    @NotNull
    private Integer availableQty; // available qty for production

    @ManyToOne
    @JoinColumn(name = "production_order_id", referencedColumnName = "id")
    @JsonIgnore
    private ProductionOrder productionOrder;

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material;
}
