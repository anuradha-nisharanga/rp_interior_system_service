package com.bit.rp_interior_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sale")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "order")
    private String order;

    @Column(name = "expected_date")
    private LocalDate expectedDate;

    @Column(name = "grand_total")
    private BigDecimal grandTotal;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

    @Column(name = "balance_amount")
    private BigDecimal balanceAmount;

    @Column(name = "total_discount")
    private BigDecimal totalAmount;

    @Column(name = "net_amount")
    private BigDecimal netAmount;

    @Column(name = "note")
    private String note;

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
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "sale_status_id", referencedColumnName = "id")
    private SaleStatus saleStatus;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleHasProduct> productList;

//    public Sale(Integer id, String grnCode, BigDecimal totalAmount, BigDecimal balanceAmount, BigDecimal paidAmount){
//        this.id = id;
//        this.grnCode = grnCode;
//        this.totalAmount = totalAmount;
//        this.balanceAmount = balanceAmount;
//        this.paidAmount = paidAmount;
//    }
}
