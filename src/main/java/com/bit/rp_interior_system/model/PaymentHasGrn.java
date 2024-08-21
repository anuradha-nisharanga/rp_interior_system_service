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
@Table(name = "payment_has_grn")
public class PaymentHasGrn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    private GRN grn;

    @ManyToOne
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    @JsonIgnore
    private SupplierPayment supplierPayment;

    @Column(name = "total_amount")
    @NotNull
    private BigDecimal totalAmount;

    @Column(name = "paid_amount")
    @NotNull
    private BigDecimal payment;

    @Column(name = "balance")
    @NotNull
    private BigDecimal balance;





}
