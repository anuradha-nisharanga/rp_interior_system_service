package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    //create query for get user by given employee
    @Query("select u from User u where u.employee.id=?1")
    public User getUserByEmployee(Integer id);

    @Query("select u from User u where u.username=?1")
    public User getUserByUserName(String username);
}
