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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sale_has_product")
public class SaleHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "product_price")
    @NotNull
    private BigDecimal price;

    @Column(name = "product_qty")
    @NotNull
    private Integer quantity;

    @Column(name = "product_discount")
    @NotNull
    private Integer discount;

    @Column(name = "line_cost")
    @NotNull
    private BigDecimal lineCost;

    @ManyToOne
    @JoinColumn(name = "sale_id", referencedColumnName = "id")
    @JsonIgnore
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;
}
