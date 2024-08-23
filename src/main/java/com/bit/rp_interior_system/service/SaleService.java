package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.GRN;
import com.bit.rp_interior_system.model.GrnStatus;
import com.bit.rp_interior_system.model.Sale;
import com.bit.rp_interior_system.model.SaleStatus;

import java.util.List;

public interface SaleService {
    List<Sale> findAllSales();

    List<SaleStatus> getSaleStatus();

    String createSale(Sale sale);

    String updateSale(Sale sale);

    String deleteSale(Sale sale);

}
