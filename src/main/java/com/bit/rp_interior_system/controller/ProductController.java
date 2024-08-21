package com.bit.rp_interior_system.controller;

import com.bit.rp_interior_system.model.Product;
import com.bit.rp_interior_system.model.ProductCategory;
import com.bit.rp_interior_system.model.ProductStatus;
import com.bit.rp_interior_system.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/view")
    public List<Product> findAllGrn(){

        return productService.findAllProducts();
    }

    @PostMapping("/create")
    public String createProduct(@RequestBody Product product){

        return productService.createProduct(product);
    }

    @PutMapping("/update")
    @Transactional
    public String updateProduct(@RequestBody Product product){

        return productService.updateProduct(product);
    }

    @DeleteMapping("/delete")
    public String deleteProduct(@RequestBody Product product){

        return productService.deleteProduct(product);
    }

    @GetMapping("/status")
    public List<ProductStatus> getProductStatusList(){

        return productService.getProductStatusList();
    }

    @GetMapping("/category")
    public List<ProductCategory> getProductCategoryList(){

        return productService.getProductCategoryList();
    }

    @RequestMapping("/ui")
    public ModelAndView viewUI(){

        //get logged user authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView view= new ModelAndView();
        //get login user name
        view.addObject("loggedUser", auth.getName());
        view.setViewName("product.html");
        view.addObject("title", "Product : BIT Project 2023");
        return view;
    }
}
