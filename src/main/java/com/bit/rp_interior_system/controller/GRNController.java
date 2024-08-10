package com.bit.rp_interior_system.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/grn")
@RequiredArgsConstructor
public class GRNController {

    @RequestMapping("/ui")
    public ModelAndView viewUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("grn.html");
        view.addObject("title", "GRN : BIT Project 2023");
        return view;
    }
}
