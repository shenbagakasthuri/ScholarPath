package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "scholarship_sources", indexes = {
    @Index(name = "idx_scholarship_sources_scholarship_id", columnList = "scholarship_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScholarshipSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(name = "source_url", nullable = false, length = 1000)
    private String sourceUrl;

    @Column(name = "source_title", length = 500)
    private String sourceTitle;

    @Column(name = "source_description", columnDefinition = "TEXT")
    private String sourceDescription;

    @CreationTimestamp
    @Column(name = "accessed_at", nullable = false, updatable = false)
    private LocalDateTime accessedAt;

    @Column(name = "is_official", nullable = false)
    @Builder.Default
    private Boolean isOfficial = true;

    @Column(name = "verification_status", nullable = false, length = 50)
    @Builder.Default
    private String verificationStatus = "VERIFIED";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
