package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.ProductionOrder;
import com.bit.rp_interior_system.model.ProductionOrderStatus;

import java.util.List;

public interface ProductionOrderService {
    List<ProductionOrder> findAllProductionOrders();

    List<ProductionOrderStatus> getProductionOrderStatus();

    String createProductionOrder(ProductionOrder productionOrder);

    String updateProductionOrder(ProductionOrder productionOrder);

    String deleteProductionOrder(ProductionOrder productionOrder);


}
