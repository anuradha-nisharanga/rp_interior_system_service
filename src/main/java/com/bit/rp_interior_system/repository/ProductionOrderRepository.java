package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.ProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Integer> {

    @Query(value = "SELECT concat('ORDER',lpad(substring(max(po.code),6)+ 1 , 4 ,'0')) " +
            "FROM rp_interiors_db.production_order as po;", nativeQuery = true)
    String getNextProdOrderNumber();

}
