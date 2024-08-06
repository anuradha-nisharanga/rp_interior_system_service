package com.bit.rp_interior_system.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/dashboard")
public class DashboardController {
    @RequestMapping("/ui")
    public ModelAndView dashboardUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewDashboard= new ModelAndView();
        //get login user name
        viewDashboard.addObject("loggedUser", auth.getName());
        viewDashboard.setViewName("dashboard.html");
        viewDashboard.addObject("title", "Dashboard : BIT Project 2023");
        return viewDashboard;

    }
}
