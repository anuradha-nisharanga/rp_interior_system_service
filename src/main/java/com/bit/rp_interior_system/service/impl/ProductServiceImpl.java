package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.*;
import com.bit.rp_interior_system.service.GRNService;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductStatusRepository productStatusRepository;
    private final GRNRepository grnRepository;
    private final PrivilegeService privilegeService;
    private final GRNStatusRepository grnStatusRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final ProductCategoryRepository productCategoryRepository;

    @Override
    public List<Product> findAllProducts() {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"product");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return productRepository.findAll();
    }

    @Override
    public List<ProductStatus> getProductStatusList() {

        return productStatusRepository.findAll();
    }

    @Override
    public List<ProductCategory> getProductCategoryList() {

        return productCategoryRepository.findAll();
    }

    @Override
    public List<Product> getActiveProductList() {
        return productRepository.getActiveProductList();
    }

    @Override
    public String createProduct(Product product) {

        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"product");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        try {
            product.setCreatedUser(logedUser.getId());
            product.setCreatedAt(LocalDateTime.now());
            product.setMaterialCost(product.getMaterialCost());

            //set next order code
            String nextNumber = productRepository.getNextItemNumber();
            if (nextNumber == null){
                nextNumber = "ITEM" + "001";
            }
            product.setCode(nextNumber);

            for (ProductHasMaterial productHasMaterial : product.getMaterialList()){
                productHasMaterial.setProduct(product);
            }

            productRepository.save(product);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }
    }

    @Override
    public String updateProduct(Product product) {
        //login user authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"product");
        if(!logUserPrivilege.get("update")){
            throw new RuntimeException("Update not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        Product existProduct = productRepository.getReferenceById(product.getId());
        if (existProduct == null){
            return "Product Not exist...!";
        }

        try {
            product.setUpdatedUser(logedUser.getId());
            product.setUpdatedAt(LocalDateTime.now());

            for (ProductHasMaterial productHasMaterial : product.getMaterialList()){
                productHasMaterial.setProduct(product);
            }
            productRepository.save(product);
            return "OK";
        }
        catch (Exception e){
            return "Update not Completed" + e.getMessage();
        }
    }

    @Override
    public String deleteProduct(Product product) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"product");
        if(!logUserPrivilege.get("delete")){
            throw new RuntimeException("Delete not completed: you have no privilege");
        }

        Optional<Product> optionalProduct = productRepository.findById(product.getId());
        if (optionalProduct.isEmpty()){
            throw new RuntimeException("Product Not Found");
        }

        try{
            ProductStatus productStatus = new ProductStatus();
            productStatus.setId(3);
            productStatus.setName("Deleted");

            Product existProduct = optionalProduct.get();
            existProduct.setProductStatus(productStatus);
            productRepository.save(existProduct);

            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

}
