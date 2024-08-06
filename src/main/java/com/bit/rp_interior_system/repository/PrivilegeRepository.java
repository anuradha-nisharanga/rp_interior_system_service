package com.bit.rp_interior_system.repository;

import com.bit.rp_interior_system.model.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Integer> {

    //create query for get privilege object by given role id and module id
    @Query("select p from Privilege p where p.role.id=?1 and p.module.id=?2")
    Privilege getByRoleModule(Integer roleId, Integer moduleId);

    //create query for get privilege by given username and module name
    @Query(value = "SELECT bit_or(p.can_select) as sel,bit_or(p.can_insert) as inst,bit_or(p.can_update) as upd,bit_or(p.can_delete) as " +
            "del FROM rp_interiors_db.privilege as p where p.role_id in (select uhr.role_id From rp_interiors_db.user_has_role as uhr " +
            "where uhr.user_id in (select u.id From rp_interiors_db.user as u where u.username =?1) )and p.module_id " +
            "in(select m.id From rp_interiors_db.module as m where m.name=?2);", nativeQuery = true)
    public String getPrivilegeByUserModule(String username, String moduleName);
}
