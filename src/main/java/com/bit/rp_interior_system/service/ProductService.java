package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.*;

import java.util.List;

public interface ProductService {
    List<Product> findAllProducts();

    String createProduct(Product product);

    String updateProduct(Product product);

    String deleteProduct(Product product);

    List<ProductStatus> getProductStatusList();

    List<ProductCategory> getProductCategoryList();
}
