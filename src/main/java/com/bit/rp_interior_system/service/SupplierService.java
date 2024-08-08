package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.Supplier;
import com.bit.rp_interior_system.model.dto.SupplierDto;

import java.util.List;

public interface SupplierService {

    List<Supplier> getAllSuppliers();

    String createSupplier(SupplierDto supplierDto);

    String updateSupplier(SupplierDto supplierDto);

    String deleteSupplier(SupplierDto supplierDto);

    List<Supplier> getSupplierList();
}
