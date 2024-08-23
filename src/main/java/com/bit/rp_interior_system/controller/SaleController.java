package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.GRN;
import com.bit.rp_interior_system.model.GrnStatus;
import com.bit.rp_interior_system.model.Sale;
import com.bit.rp_interior_system.model.SaleStatus;
import com.bit.rp_interior_system.service.SaleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/sale")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping("/view")
    public List<Sale> findAllSales(){

        return saleService.findAllSales();
    }

    @PostMapping("/create")
    public String createSale(@RequestBody Sale sale){

        return saleService.createSale(sale);
    }

    @PutMapping("/update")
    @Transactional
    public String updateSale(@RequestBody Sale sale){

        return saleService.updateSale(sale);
    }

    @DeleteMapping("/delete")
    public String deleteSale(@RequestBody Sale sale){

        return saleService.deleteSale(sale);
    }

    @GetMapping("/status")
    public List<SaleStatus> getGRNStatusList(){

        return saleService.getSaleStatus();
    }

    @RequestMapping("/ui")
    public ModelAndView viewUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("sale.html");
        view.addObject("title", "Sale : BIT Project 2023");
        return view;
    }
}
