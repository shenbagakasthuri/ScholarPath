package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scholarship_matches", indexes = {
    @Index(name = "idx_scholarship_matches_student_profile_id", columnList = "student_profile_id"),
    @Index(name = "idx_scholarship_matches_scholarship_id", columnList = "scholarship_id"),
    @Index(name = "idx_scholarship_matches_eligibility_status", columnList = "eligibility_status"),
    @Index(name = "idx_scholarship_matches_match_score", columnList = "match_score")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_scholarship_matches_student_scholarship", columnNames = {"student_profile_id", "scholarship_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScholarshipMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Column(name = "match_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(name = "eligibility_status", nullable = false, length = 50)
    private String eligibilityStatus;

    @Column(name = "matched_criteria_count", nullable = false)
    @Builder.Default
    private Integer matchedCriteriaCount = 0;

    @Column(name = "total_mandatory_criteria_count", nullable = false)
    @Builder.Default
    private Integer totalMandatoryCriteriaCount = 0;

    @Column(name = "missing_criteria_json", columnDefinition = "JSON")
    private String missingCriteriaJson;

    @Column(name = "verified_criteria_json", columnDefinition = "JSON")
    private String verifiedCriteriaJson;

    @Column(name = "unverified_criteria_json", columnDefinition = "JSON")
    private String unverifiedCriteriaJson;

    @Column(name = "match_explanation", columnDefinition = "TEXT")
    private String matchExplanation;

    @Column(name = "ai_generated_explanation", columnDefinition = "TEXT")
    private String aiGeneratedExplanation;

    @Column(name = "is_notified", nullable = false)
    @Builder.Default
    private Boolean isNotified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
