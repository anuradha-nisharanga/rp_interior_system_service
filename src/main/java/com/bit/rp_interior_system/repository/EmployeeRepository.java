package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository <Employee,Integer> {

    Optional<Employee> findByMobile(String employeeNo);

    Optional<Employee> findByNic(String nic);

    Optional<Employee> findByEmail(String email);

    @Query(value = "SELECT concat('E', lpad(substring(max(e.emp_no),2)+ 1 , 3 ,'0')) " +
            "FROM rp_interiors_db.employee as e;", nativeQuery = true)
    String nextEmpNo();

    //define query for get Employee list without user Account
    @Query(value = "SELECT e from Employee e WHERE e.id not in (select u.employee from User u) " +
            "and e.status.id = 2")//changed
    List<Employee> getEmployeeListWithoutUserAccount();
}
