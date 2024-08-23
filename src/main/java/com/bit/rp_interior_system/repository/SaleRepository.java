package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Integer> {

    @Query(value = "SELECT concat('Order', lpad(substring(max(s.order),5)+ 1 , 4 ,'0')) " +
            "FROM rp_interiors_db.sale as s;", nativeQuery = true)
    String getNextGrnNumber();
}
