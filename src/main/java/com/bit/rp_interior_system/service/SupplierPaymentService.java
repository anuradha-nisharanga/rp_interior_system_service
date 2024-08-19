package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.SupplierPayment;
import com.bit.rp_interior_system.model.SupplierPaymentStatus;
import com.bit.rp_interior_system.model.SupplierPaymentType;

import java.util.List;

public interface SupplierPaymentService {
    List<SupplierPayment> findAllSupplierPayments();

    List<SupplierPaymentStatus> findAllSupplierPaymentStatus();

    List<SupplierPaymentType> findAllSupplierPaymentTypes();

    String createPayment(SupplierPayment supplierPayment);

    String updatePayment(SupplierPayment supplierPayment);

    String deletePayment(SupplierPayment supplierPayment);
}
