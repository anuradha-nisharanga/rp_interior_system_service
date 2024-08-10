package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {
    @Query(value = "SELECT concat(year(current_date()),lpad(substring(max(po.purchase_order_code),5)+1 , 6 , 0) ) FROM rp_interiors_db.purchase_order as po where year(current_date()) = year(po.created_at);", nativeQuery = true)
    String getNextNumber();

    @Query(value = "select po from PurchaseOrder po where po.supplier.id = :supId ")
    List<PurchaseOrder> getPurchaseOrdersBySupplier();
}
