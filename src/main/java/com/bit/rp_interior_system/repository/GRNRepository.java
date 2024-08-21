package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.GRN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GRNRepository extends JpaRepository<GRN, Integer> {
    @Query(value = "SELECT concat('GRN', lpad(substring(max(g.grn_code),4)+ 1 , 6 ,'0')) " +
            "FROM rp_interiors_db.grn as g;", nativeQuery = true)
    String getNextGrnNumber();

    @Query(value = "select NEW GRN (g.id, g.grnCode, g.totalAmount, g.balanceAmount, g.paidAmount) From GRN g where g.supplier.id = :supId" )
    List<GRN> supplierGrnList(@Param("supId") Integer supplierId);
}
