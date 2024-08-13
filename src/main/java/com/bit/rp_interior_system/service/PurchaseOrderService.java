package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.PurchaseOrder;
import com.bit.rp_interior_system.model.PurchaseOrderStatus;

import java.util.List;

public interface PurchaseOrderService {
    List<PurchaseOrder> getPurchaseOrders();

    List<PurchaseOrderStatus> getPurchaseOrderStatusList();

    String createPurchaseOrder(PurchaseOrder purchaseOrder);

    String updatePurchaseOrder(PurchaseOrder purchaseOrder);

    String deletePurchaseOrder(PurchaseOrder purchaseOrder);

    List<PurchaseOrder> getPurchaseOrdersBySupplier(Integer supplierId);
}
