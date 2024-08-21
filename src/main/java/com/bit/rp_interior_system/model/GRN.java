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
@Table(name = "grn")
public class GRN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "note")
    private String note;

    @Column(name = "grn_code")
    private String grnCode;

    @Column(name = "bill_no")
    private String billNo;

    @Column(name = "grn_date")
    private LocalDate grnDate;

    @Column(name = "discount_rate")
    private BigDecimal discountRate;

    @Column(name = "net_amount")
    private BigDecimal netAmount;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "balance_amount")
    private BigDecimal balanceAmount;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

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

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "grn_status_id", referencedColumnName = "id")
    private GrnStatus grnStatus;

    @OneToMany(mappedBy = "grn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GRNHasMaterial> grnMaterialList;

    public GRN(Integer id, String grnCode, BigDecimal totalAmount, BigDecimal balanceAmount, BigDecimal paidAmount){
        this.id = id;
        this.grnCode = grnCode;
        this.totalAmount = totalAmount;
        this.balanceAmount = balanceAmount;
        this.paidAmount = paidAmount;
    }
}
