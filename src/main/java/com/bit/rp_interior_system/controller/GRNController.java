package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.GRN;
import com.bit.rp_interior_system.model.GrnStatus;
import com.bit.rp_interior_system.model.PurchaseOrder;
import com.bit.rp_interior_system.model.PurchaseOrderStatus;
import com.bit.rp_interior_system.service.GRNService;
import com.bit.rp_interior_system.service.PurchaseOrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/grn")
@RequiredArgsConstructor
public class GRNController {

    private final GRNService grnService;

    @GetMapping("/view")
    public List<GRN> findAllGrn(){

        return grnService.findAllGrn();
    }

    @PostMapping("/create")
    public String createGrn(@RequestBody GRN grn){

        return grnService.createGrn(grn);
    }

    @PutMapping("/update")
    @Transactional
    public String updateGrn(@RequestBody GRN grn){

        return grnService.updateGrn(grn);
    }

    @DeleteMapping("/delete")
    public String deleteGrn(@RequestBody GRN grn){

        return grnService.deleteDrn(grn);
    }

    @GetMapping("/status")
    public List<GrnStatus> getGRNStatusList(){

        return grnService.getGRNStatusList();
    }

    @GetMapping("/list/{supId}")
    public List<GRN> getGrnListBySupplier(@PathVariable ("supId") Integer supplierId){

        return grnService.getGrnListBySupplier(supplierId);
    }

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
