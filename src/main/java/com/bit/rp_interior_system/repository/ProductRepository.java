package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query(value = "SELECT concat('ITEM', lpad(substring(max(p.code),5)+ 1 , 3 ,'0')) " +
            "FROM rp_interiors_db.product as p;", nativeQuery = true)
    String getNextItemNumber();
}
