package com.bit.rp_interior_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "production_order_has_product")
public class ProductionOrderHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_qty")
    @NotNull
    private Integer orderQty;

    @Column(name = "completed_qty")
    @NotNull
    private Integer completedQty; // total completed quantity in production

    @ManyToOne
    @JoinColumn(name = "production_order_id", referencedColumnName = "id")
    @JsonIgnore
    private ProductionOrder productionOrder;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;
}
