package com.bit.rp_interior_system.service;

import com.bit.rp_interior_system.model.GRN;
import com.bit.rp_interior_system.model.GrnStatus;

import java.util.List;

public interface GRNService {
    List<GRN> findAllGrn();

    List<GrnStatus> getGRNStatusList();

    String createGrn(GRN grn);

    String updateGrn(GRN grn);

    String deleteDrn(GRN grn);

    List<GRN> getGrnListBySupplier(Integer supplierId);
}
