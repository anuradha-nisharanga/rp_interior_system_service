package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.GRN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GRNRepository extends JpaRepository<GRN, Integer> {
    @Query(value = "SELECT concat('GRN', lpad(substring(max(g.grn_code),4)+ 1 , 6 ,'0')) " +
            "FROM rp_interiors_db.grn as g;", nativeQuery = true)
    String getNextGrnNumber();
}
