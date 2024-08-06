package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query(value = "SELECT concat('C', lpad(substring(max(c.code),2)+ 1 , 5 ,'0')) FROM rp_interiors_db.customer as c;", nativeQuery = true)
    String nextCustomerNo();
}
