package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Material;
import com.bit.rp_interior_system.model.MaterialCategory;
import com.bit.rp_interior_system.model.dto.MaterialDto;
import org.springframework.stereotype.Service;

import java.util.List;

public interface MaterialService {

    String createMaterial(MaterialDto materialDto);

    List<Material> getMaterialDetails();

    List<MaterialCategory> getMaterialCategoryList();

    String updateMaterial(MaterialDto materialDto);

    String deleteMaterial(MaterialDto materialDto);

    List<Material> getAvailableMaterial();

    List<Material> getSupplierNotProvideMaterials(Integer supplierId);

    List<Material> getSupplierProvideMaterials(Integer supplierId);

    List<Material> getMaterialsByPurchaseOrder(Integer purchaseOrderId);

    Material getMaterialStockByMaterial(Integer matId);
}

