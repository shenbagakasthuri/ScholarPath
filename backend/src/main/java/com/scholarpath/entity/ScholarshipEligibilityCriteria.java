package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scholarship_eligibility_criteria", indexes = {
    @Index(name = "idx_scholarship_eligibility_scholarship_id", columnList = "scholarship_id"),
    @Index(name = "idx_scholarship_eligibility_criteria_key", columnList = "criteria_key"),
    @Index(name = "idx_scholarship_eligibility_is_mandatory", columnList = "is_mandatory")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScholarshipEligibilityCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Column(name = "criteria_key", nullable = false, length = 100)
    private String criteriaKey;

    @Column(name = "criteria_label", nullable = false, length = 255)
    private String criteriaLabel;

    @Column(name = "criteria_description", columnDefinition = "TEXT")
    private String criteriaDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "criteria_type", nullable = false, length = 50)
    private CriteriaType criteriaType;

    @Enumerated(EnumType.STRING)
    @Column(name = "operator", nullable = false, length = 20)
    private Operator operator;

    @Column(name = "value_text", length = 500)
    private String valueText;

    @Column(name = "value_number_min", precision = 15, scale = 2)
    private BigDecimal valueNumberMin;

    @Column(name = "value_number_max", precision = 15, scale = 2)
    private BigDecimal valueNumberMax;

    @Column(name = "value_boolean")
    private Boolean valueBoolean;

    @Column(name = "value_json", columnDefinition = "JSON")
    private String valueJson;

    @Column(name = "is_mandatory", nullable = false)
    @Builder.Default
    private Boolean isMandatory = true;

    @Column(name = "weight", nullable = false)
    @Builder.Default
    private Integer weight = 1;

    @Column(name = "source_url", length = 1000)
    private String sourceUrl;

    @Column(name = "source_document", length = 500)
    private String sourceDocument;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 50)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum CriteriaType {
        course, state, income, marks, category, gender, age, disability, year_of_study
    }

    public enum Operator {
        EQUALS, IN, LTE, GTE, BETWEEN, CONTAINS
    }

    public enum VerificationStatus {
        PENDING, VERIFIED, DEMO_DATA
    }
}