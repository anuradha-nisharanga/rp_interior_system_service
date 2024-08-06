package com.bit.rp_interior_system.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "material_has_supplier")
public class SupplierHasMaterial {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material;
}
