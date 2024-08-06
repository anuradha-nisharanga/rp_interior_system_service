package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Employee;
import com.bit.rp_interior_system.model.User;
import com.bit.rp_interior_system.model.dto.EmployeeDto;
import com.bit.rp_interior_system.model.dto.UserDto;
import com.bit.rp_interior_system.service.EmployeeService;
import com.bit.rp_interior_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController( UserService userService){
        this.userService = userService;
    }

    @PostMapping("/create")
    @ResponseBody
    public String createUser(@RequestBody UserDto userDto){
        return userService.createUser(userDto);
    }

    @GetMapping("/find")
    @ResponseBody
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PutMapping("/update")
    @ResponseBody
    public String updateUser(@RequestBody UserDto userDto){
        return userService.updateUser(userDto);
    }

    @DeleteMapping("/delete")
    public String deleteUser(@RequestBody UserDto userDto){
        return userService.deleteUser(userDto);
    }

    @RequestMapping("/ui")
    public ModelAndView userUI(){
        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView viewUser= new ModelAndView();
        //get login user name
        viewUser.addObject("loggedUser", auth.getName());
        viewUser.setViewName("user.html");
        viewUser.addObject("title", "User : BIT Project 2023");
        return viewUser;
    }
}
