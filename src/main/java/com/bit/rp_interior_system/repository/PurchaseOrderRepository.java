package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    @Query(value = "SELECT concat(year(current_date()),lpad(substring(max(po.purchase_order_code),5)+1 , 6 , 0) ) FROM rp_interiors_db.purchase_order as po where year(current_date()) = year(po.created_at);", nativeQuery = true)
    String getNextNumber();

    @Query(value = "SELECT NEW PurchaseOrder(po.id, po.purchaseOrderCode) FROM PurchaseOrder po WHERE po.supplier.id = :supId AND po.purchaseOrderStatus.id = 1")
    List<PurchaseOrder> getPurchaseOrdersBySupplier(@Param("supId") Integer supplierId);
}
