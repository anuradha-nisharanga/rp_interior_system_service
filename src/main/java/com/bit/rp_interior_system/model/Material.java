package com.bit.rp_interior_system.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "material")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    @Column(name = "qty")
    private Integer quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "reorder_point")
    private Integer reorderPoint;

    @Column(name = "note")
    private String note;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "created_date")
    @CreatedDate
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    @LastModifiedDate
    private LocalDateTime lastModifyDate;

    @Column(name = "deleted_date")
    private LocalDateTime deletedDate;

    @ManyToOne
    @JoinColumn(name = "material_category", referencedColumnName = "id")
    private MaterialCategory materialCategory;

    @ManyToOne
    @JoinColumn(name = "created_user", referencedColumnName = "id")
    private User createdUser;

    @Column(name = "updated_user")
    private Integer updatedUser;

    @Column(name = "deleted_user")
    private Integer deletedUser;

    public Material(Integer id, String code, String name, BigDecimal unitPrice){
        this.id = id;
        this.code = code;
        this.name = name;
        this.unitPrice = unitPrice;
    }
}
