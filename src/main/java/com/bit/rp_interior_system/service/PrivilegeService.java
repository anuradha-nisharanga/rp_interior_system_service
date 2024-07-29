package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Privilege;
import com.bit.rp_interior_system.model.dto.PrivilegeDto;

import java.util.HashMap;
import java.util.List;

public interface PrivilegeService {
    String createPrivilege(PrivilegeDto privilegeDto);

    List<Privilege> getAllPrivieleges();

    String updatePrivilege(PrivilegeDto privilegeDto);

    String deletePrivilege(PrivilegeDto privilegeDto);

    HashMap<String, Boolean> getAllPrivilegeByUserModule(String username, String moduleName);
}
