package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    @Query("select new Supplier(s.id, s.name) from Supplier s where s.status = true ")
    List<Supplier> list();
}
