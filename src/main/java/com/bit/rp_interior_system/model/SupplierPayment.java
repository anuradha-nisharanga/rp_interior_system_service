package com.bit.rp_interior_system.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "supplier_payment")
public class SupplierPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "bill_amount")
    private BigDecimal billAmount;

    @Column(name = "cheque_no")
    private String chequeNo;

    @Column(name = "bill_no")
    private String billNo;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "payment_type_id", referencedColumnName = "id")
    private SupplierPaymentType supplierPaymentType;

    @ManyToOne
    @JoinColumn(name = "payment_status_id", referencedColumnName = "id")
    private SupplierPaymentStatus supplierPaymentStatus;

    @OneToMany(mappedBy = "supplierPayment", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<PaymentHasGrn> grnList;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_user")
    private Integer createdUser;

    @Column(name = "updated_user")
    private Integer updatedUser;

    @Column(name = "deleted_user")
    private Integer deletedUser;

}
