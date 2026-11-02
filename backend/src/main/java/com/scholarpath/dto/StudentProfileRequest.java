package com.scholarpath.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class StudentProfileRequest {

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Size(max = 20, message = "Gender must be at most 20 characters")
    private String gender;

    @Size(max = 50, message = "Category must be at most 50 characters")
    private String category;

    @Size(max = 50, message = "Sub category must be at most 50 characters")
    private String subCategory;

    @Size(max = 100, message = "Disability type must be at most 100 characters")
    private String disabilityType;

    @PositiveOrZero(message = "Disability percentage must be zero or greater")
    private Integer disabilityPercentage;

    @DecimalMin(value = "0.00", inclusive = true, message = "Annual family income must be zero or greater")
    private BigDecimal annualFamilyIncome;

    @Size(max = 100, message = "Income certificate number must be at most 100 characters")
    private String incomeCertificateNumber;

    @Past(message = "Income certificate date must be in the past")
    private LocalDate incomeCertificateDate;

    @Size(max = 100, message = "Domicile state must be at most 100 characters")
    private String domicileState;

    @Size(max = 100, message = "Domicile district must be at most 100 characters")
    private String domicileDistrict;

    @Size(max = 100, message = "Domicile certificate number must be at most 100 characters")
    private String domicileCertificateNumber;

    @Size(max = 14, message = "Aadhaar number must be at most 14 characters")
    private String aadhaarNumber;

    @Size(max = 30, message = "Bank account number must be at most 30 characters")
    private String bankAccountNumber;

    @Size(max = 11, message = "Bank IFSC code must be at most 11 characters")
    private String bankIfscCode;

    @Size(max = 255, message = "Bank account holder name must be at most 255 characters")
    private String bankAccountHolderName;
}
