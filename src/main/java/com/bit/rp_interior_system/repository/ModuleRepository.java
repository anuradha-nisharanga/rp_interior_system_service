package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {

    //create query for get module list for not privilege for users
    @Query("select m from Module m where m.id not in (select p.module.id from Privilege p where p.role.id=?1)")
    public List<Module> getModuleByRole(Integer roleId);

}
