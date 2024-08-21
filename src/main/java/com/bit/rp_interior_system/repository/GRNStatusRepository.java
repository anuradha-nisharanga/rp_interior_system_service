package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.GrnStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GRNStatusRepository extends JpaRepository<GrnStatus, Integer> {
}
