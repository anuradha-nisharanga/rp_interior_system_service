package com.bit.rp_interior_system.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@CrossOrigin
public class LoginController {

    @GetMapping(value = "/login")
    public ModelAndView loginPage(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("login.html");
        return loginView;
    }

    @GetMapping(value = "/error")
    public ModelAndView errorPage(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("error.html");
        return loginView;
    }

    @GetMapping(value = "/index")
    public ModelAndView indexPage(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("mainwindow.html");
        return loginView;
    }

    @GetMapping(value = "/dashboard")
    public ModelAndView dashboardPage(){
        ModelAndView loginView = new ModelAndView();
        loginView.setViewName("dashboard.html");
        return loginView;
    }

}
