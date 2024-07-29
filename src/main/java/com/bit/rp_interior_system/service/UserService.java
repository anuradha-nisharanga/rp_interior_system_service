package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.UserDto;

import java.util.List;

public interface UserService {
    String createUser(UserDto userDto);

    List<User> getAllUsers();

    String updateUser(UserDto userDto);

    String deleteUser(UserDto userDto);
}
