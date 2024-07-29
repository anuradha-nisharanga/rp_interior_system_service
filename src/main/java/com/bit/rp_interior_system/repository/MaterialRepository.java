package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository  extends JpaRepository<Material, Integer>{

    @Query(value = "SELECT concat('M', lpad(substring(max(m.code),2)+ 1 , 5 ,'0')) FROM rp_interiors_db.material as m;", nativeQuery = true)
    String nextMaterialCodeNo();
}
