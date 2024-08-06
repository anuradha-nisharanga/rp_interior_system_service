package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository  extends JpaRepository<Material, Integer>{

    @Query(value = "SELECT concat('M', lpad(substring(max(m.code),2)+ 1 , 5 ,'0')) FROM rp_interiors_db.material as m;", nativeQuery = true)
    String nextMaterialCodeNo();

    @Query(value = "SELECT NEW Material (m.id, m.code, m.name) from Material m where m.status = true")
    List<Material> getAvailableMaterialList();

    @Query(value = "SELECT NEW Material (m.id, m.code, m.name) from Material m where m.status = true and  " +
            " m.id NOT IN (SELECT shi.material.id from SupplierHasMaterial shi where shi.supplier.id = :supId) ")
    List<Material> getSupplierNotProvideMaterials(@Param("supId") Integer supplierId);
}
