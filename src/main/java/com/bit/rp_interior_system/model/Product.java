package com.bit.rp_interior_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "available_qty")
    private Integer availableQty;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "reorder_level")
    private String reorderLevel;

    @Column(name = "reorder_qty")
    private Integer reorderQty;

    @Column(name = "material_cost")
    private BigDecimal materialCost;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "product_status_id", referencedColumnName = "id")
    private ProductStatus productStatus;

    @ManyToOne
    @JoinColumn(name = "product_category_id", referencedColumnName = "id")
    private ProductCategory productCategory;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductHasMaterial> materialList;

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
