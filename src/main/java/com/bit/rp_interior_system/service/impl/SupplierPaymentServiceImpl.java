package com.bit.rp_interior_system.service.impl;

import com.bit.rp_interior_system.model.*;
import com.bit.rp_interior_system.repository.*;
import com.bit.rp_interior_system.service.PrivilegeService;
import com.bit.rp_interior_system.service.SupplierPaymentService;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class SupplierPaymentServiceImpl implements SupplierPaymentService {

    private final PrivilegeService privilegeService;
    private final SupplierPaymentRepository supplierPaymentRepository;
    private final SupplierPaymentStatusRepository supplierPaymentStatusRepository;
    private final SupplierPaymentTypeRepository supplierPaymentTypeRepository;
    private final UserRepository userRepository;
    private final GRNRepository grnRepository;

    @Override
    public List<SupplierPayment> findAllSupplierPayments() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier-payment");
        if(!logUserPrivilege.get("select")){
            return null;
        }

        return supplierPaymentRepository.findAll();
    }

    @Override
    public String createPayment(SupplierPayment supplierPayment) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier-payment");
        if(!logUserPrivilege.get("insert")){
            throw new RuntimeException("Insert not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        try {
            supplierPayment.setCreatedUser(logedUser.getId());
            supplierPayment.setCreatedAt(LocalDateTime.now());
            supplierPayment.setBillAmount(supplierPayment.getBillAmount());
            supplierPayment.setBillNo(supplierPayment.getBillNo());
            supplierPayment.setChequeNo(supplierPayment.getChequeNo());

            for (PaymentHasGrn paymentHasGrn : supplierPayment.getGrnList()){
                paymentHasGrn.setSupplierPayment(supplierPayment);

                Optional<GRN> OptionalGrn = grnRepository.findById(paymentHasGrn.getGrn().getId());
                if (OptionalGrn.isPresent()){
                    GRN grn = OptionalGrn.get();
                    grn.setBalanceAmount(paymentHasGrn.getBalance());

                    BigDecimal totalAmount = grn.getTotalAmount();
                    BigDecimal balanceAmount = paymentHasGrn.getBalance();

                    BigDecimal totalPaidAmount = totalAmount.subtract(balanceAmount);
                    grn.setPaidAmount(totalPaidAmount);

                    GRN savedGrn = grnRepository.save(grn);
                    log.info("GRN ID: {} | Updated Balance : {}", savedGrn.getGrnCode(), savedGrn.getBalanceAmount() );
                }
            }

            supplierPaymentRepository.save(supplierPayment);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }

    }

    @Override
    public String updatePayment(SupplierPayment supplierPayment) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier-payment");
        if(!logUserPrivilege.get("update")){
            throw new RuntimeException("Update not completed: you have no privilege");
        }

        User logedUser = userRepository.getUserByUserName(auth.getName());

        Optional<SupplierPayment> supplierPaymentOptional = supplierPaymentRepository.findById(supplierPayment.getId());
        if (supplierPaymentOptional.isEmpty()){
            return "Supplier payment Does Not exist...!";
        }

        try {
            SupplierPayment existSupplierPayment = supplierPaymentOptional.get();
            existSupplierPayment.setUpdatedUser(logedUser.getId());
            existSupplierPayment.setUpdatedAt(LocalDateTime.now());
            existSupplierPayment.setBillAmount(supplierPayment.getBillAmount());
            existSupplierPayment.setBillNo(supplierPayment.getBillNo());
            existSupplierPayment.setChequeNo(supplierPayment.getChequeNo());

            for (PaymentHasGrn paymentHasGrn : supplierPayment.getGrnList()){
                paymentHasGrn.setSupplierPayment(supplierPayment);

                Optional<GRN> OptionalGrn = grnRepository.findById(paymentHasGrn.getGrn().getId());
                if (OptionalGrn.isPresent()){
                    GRN grn = OptionalGrn.get();
                    grn.setBalanceAmount(paymentHasGrn.getBalance());
                    GRN savedGrn = grnRepository.save(grn);
                    log.info("GRN ID: {} | Updated Balance : {}", savedGrn.getGrnCode(), savedGrn.getBalanceAmount() );
                }
            }

            supplierPaymentRepository.save(supplierPayment);

            return "OK";
        }
        catch (Exception e){
            return "Save not Completed" + e.getMessage();
        }
    }

    @Override
    public String deletePayment(SupplierPayment supplierPayment) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        HashMap<String,Boolean> logUserPrivilege = privilegeService.getAllPrivilegeByUserModule(auth.getName(),"supplier-payment");
        if(!logUserPrivilege.get("delete")){
            throw new RuntimeException("Delete not completed: you have no privilege");
        }

        Optional<SupplierPayment> optionalPayment = supplierPaymentRepository.findById(supplierPayment.getId());
        if (optionalPayment.isEmpty()){
            throw new RuntimeException("Payment Not Found");
        }

        try{
            SupplierPaymentStatus paymentStatus = new SupplierPaymentStatus();
            paymentStatus.setId(3);
            paymentStatus.setName("Deleted");

            SupplierPayment existPayment = optionalPayment.get();
            existPayment.setSupplierPaymentStatus(paymentStatus);
            supplierPaymentRepository.save(existPayment);

            return "OK";
        }
        catch (Exception e){
            return "Delete not completed : " + e.getMessage();
        }
    }

    @Override
    public List<SupplierPaymentStatus> findAllSupplierPaymentStatus() {

        return supplierPaymentStatusRepository.findAll();
    }

    @Override
    public List<SupplierPaymentType> findAllSupplierPaymentTypes() {

        return supplierPaymentTypeRepository.findAll();
    }


}
