package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scholarships", indexes = {
    @Index(name = "idx_scholarships_slug", columnList = "slug"),
    @Index(name = "idx_scholarships_provider_name", columnList = "provider_name"),
    @Index(name = "idx_scholarships_academic_year", columnList = "academic_year"),
    @Index(name = "idx_scholarships_is_active", columnList = "is_active"),
    @Index(name = "idx_scholarships_application_end_date", columnList = "application_end_date"),
    @Index(name = "idx_scholarships_scholarship_type", columnList = "scholarship_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "slug", nullable = false, unique = true, length = 200)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "provider_name", nullable = false, length = 255)
    private String providerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false, length = 50)
    private ProviderType providerType;

    @Column(name = "provider_website", length = 500)
    private String providerWebsite;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "scholarship_type", nullable = false, length = 50)
    private ScholarshipType scholarshipType;

    @Column(name = "amount_min", precision = 15, scale = 2)
    private BigDecimal amountMin;

    @Column(name = "amount_max", precision = 15, scale = 2)
    private BigDecimal amountMax;

    @Column(name = "amount_description", length = 500)
    private String amountDescription;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "frequency", length = 50)
    private String frequency;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "application_start_date")
    private LocalDate applicationStartDate;

    @Column(name = "application_end_date")
    private LocalDate applicationEndDate;

    @Column(name = "application_mode", length = 50)
    private String applicationMode;

    @Column(name = "application_url", length = 1000)
    private String applicationUrl;

    @Column(name = "official_notification_url", length = 1000)
    private String officialNotificationUrl;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_verified", nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 50)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @Column(name = "verified_by", length = 100)
    private String verifiedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "scholarship", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ScholarshipEligibilityCriteria> eligibilityCriteria = new ArrayList<>();

    public enum ProviderType {
        government, state, central, university, private_, ngo, corporate, international
    }

    public enum ScholarshipType {
        merit, need, merit_need, sports, minority, disability, women, general
    }

    public enum VerificationStatus {
        PENDING, VERIFIED, DEMO_DATA
    }
}