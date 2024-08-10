package com.bit.rp_interior_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "purchase_order_has_material")
public class PurchaseOrderHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "unit_price")
    @NotNull
    private BigDecimal unitPrice;

    @Column(name = "order_qty")
    @NotNull
    private Integer orderQty;

    @Column(name = "line_price")
    @NotNull
    private BigDecimal linePrice;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    @JsonIgnore
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material;
}
