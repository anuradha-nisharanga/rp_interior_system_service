package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {
}
