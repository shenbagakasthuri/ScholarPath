package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles", indexes = {
    @Index(name = "idx_student_profiles_user_id", columnList = "user_id"),
    @Index(name = "idx_student_profiles_category", columnList = "category"),
    @Index(name = "idx_student_profiles_domicile_state", columnList = "domicile_state")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "sub_category", length = 50)
    private String subCategory;

    @Column(name = "disability_type", length = 100)
    private String disabilityType;

    @Column(name = "disability_percentage")
    private Integer disabilityPercentage;

    @Column(name = "annual_family_income", precision = 15, scale = 2)
    private java.math.BigDecimal annualFamilyIncome;

    @Column(name = "income_certificate_number", length = 100)
    private String incomeCertificateNumber;

    @Column(name = "income_certificate_date")
    private LocalDate incomeCertificateDate;

    @Column(name = "domicile_state", length = 100)
    private String domicileState;

    @Column(name = "domicile_district", length = 100)
    private String domicileDistrict;

    @Column(name = "domicile_certificate_number", length = 100)
    private String domicileCertificateNumber;

    @Column(name = "aadhaar_number", length = 14)
    private String aadhaarNumber;

    @Column(name = "bank_account_number", length = 30)
    private String bankAccountNumber;

    @Column(name = "bank_ifsc_code", length = 11)
    private String bankIfscCode;

    @Column(name = "bank_account_holder_name", length = 255)
    private String bankAccountHolderName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<EducationalBackground> educationalBackgrounds = new ArrayList<>();
}