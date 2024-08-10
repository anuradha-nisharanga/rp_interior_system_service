package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Material;
import com.bit.rp_interior_system.model.MaterialCategory;
import com.bit.rp_interior_system.model.dto.MaterialDto;
import com.bit.rp_interior_system.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/material")
@RequiredArgsConstructor
public class MaterialController {

    private  final MaterialService materialService;

    @PostMapping("/create")
    public String createMaterial(@RequestBody MaterialDto materialDto){

        return materialService.createMaterial(materialDto);
    }

    @GetMapping("/view")
    public List<Material> getMaterialsList(){

        return materialService.getMaterialDetails();
    }

    @PutMapping("/update")
    public String updateMaterial(@RequestBody MaterialDto materialDto){

        return materialService.updateMaterial(materialDto);
    }

    @DeleteMapping("/delete")
    public String deleteMaterial(@RequestBody MaterialDto materialDto){

        return materialService.deleteMaterial(materialDto);
    }

    @GetMapping("/material-categories")
    public List<MaterialCategory> getMaterialCategoryList(){

        return materialService.getMaterialCategoryList();
    }

    @GetMapping("/available-list")
    public List<Material> getAvailableMaterial(){

        return materialService.getAvailableMaterial();
    }

    @GetMapping("/supplier-provide/{supId}")
    public List<Material> getSupplierProvideMaterials(@PathVariable ("supId") Integer supplierId){

        return materialService.getSupplierProvideMaterials(supplierId);
    }

    @GetMapping("/supplier-not-provide/{supId}")
    public List<Material> getSupplierNotProvideMaterials(@PathVariable ("supId") Integer supplierId){

        return materialService.getSupplierNotProvideMaterials(supplierId);
    }

    @RequestMapping("/ui")
    public ModelAndView materialUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView viewMaterial= new ModelAndView();
        //get login user name
        viewMaterial.addObject("loggedUser", auth.getName());
        viewMaterial.setViewName("material.html");
        viewMaterial.addObject("title", "Material : BIT Project 2023");
        return viewMaterial;
    }
}
