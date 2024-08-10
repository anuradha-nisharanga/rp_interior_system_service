package com.bit.rp_interior_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "purchase_order")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "purchase_order_code")
    private String purchaseOrderCode;

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

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
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "purchase_order_status_id", referencedColumnName = "id")
    private PurchaseOrderStatus purchaseOrderStatus;

    /*set the class attribute purchaseOrder instead purchase_order_id
    * cascade type all add for map to the association table when inserting updating
    * OrphanRemoval use for delete the association table data when updating inner form data like removing materials*/

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderHasMaterial> materialList;
}
