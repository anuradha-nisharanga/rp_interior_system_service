package com.bit.rp_interior_system.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;

    @Column(name = "emp_no")
    private String employeeNo;

    @Column(name = "nic")
    private String nic;

    @Column(name = "email")
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "calling_name")
    private String callingName;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "land_no")
    private String landNo;

    @Column(name = "address")
    private String address;

    @Column(name = "note")
    private String note;

    @Column(name = "gender")
    private String gender;

    @Column(name = "civil_status")
    private String civilStatus;

    @Column(name = "date_of_birth")
    private LocalDate dob;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "nic")
    private LocalDateTime lastModify;

    @Column(name = "nic")
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "employee_status_id", referencedColumnName = "id")
    private EmployeeStatus employeeStatus;

    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation;

}
