package com.bit.rp_interior_system.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/report")
public class ReportController {

    //get the sales report UI
    @RequestMapping("/sales")
    public ModelAndView salesReportUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewReport= new ModelAndView();
        //get login user name
        viewReport.addObject("loggedUser", auth.getName());
        viewReport.setViewName("salesReport.html");
        viewReport.addObject("title", "Reports : BIT Project 2023");
        return viewReport;
    }

    //get the sales report UI
    @RequestMapping("/customers")
    public ModelAndView customersReportUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewReport= new ModelAndView();
        //get login user name
        viewReport.addObject("loggedUser", auth.getName());
        viewReport.setViewName("customerReport.html");
        viewReport.addObject("title", "Reports : BIT Project 2023");
        return viewReport;
    }
}
