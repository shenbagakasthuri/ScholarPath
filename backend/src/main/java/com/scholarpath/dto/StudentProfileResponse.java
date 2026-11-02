package com.scholarpath.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StudentProfileResponse {
    private Long id;
    private Long userId;
    private LocalDate dateOfBirth;
    private String gender;
    private String category;
    private String subCategory;
    private String disabilityType;
    private Integer disabilityPercentage;
    private BigDecimal annualFamilyIncome;
    private String incomeCertificateNumber;
    private LocalDate incomeCertificateDate;
    private String domicileState;
    private String domicileDistrict;
    private String domicileCertificateNumber;
    private String aadhaarNumber;
    private String bankAccountNumber;
    private String bankIfscCode;
    private String bankAccountHolderName;
}
