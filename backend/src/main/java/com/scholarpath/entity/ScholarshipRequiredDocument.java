package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "scholarship_required_documents", indexes = {
    @Index(name = "idx_scholarship_documents_scholarship_id", columnList = "scholarship_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScholarshipRequiredDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scholarship_id", nullable = false)
    private Scholarship scholarship;

    @Column(name = "document_name", nullable = false, length = 255)
    private String documentName;

    @Column(name = "document_description", columnDefinition = "TEXT")
    private String documentDescription;

    @Column(name = "is_mandatory", nullable = false)
    @Builder.Default
    private Boolean isMandatory = true;

    @Column(name = "accepted_formats", length = 200)
    private String acceptedFormats;

    @Column(name = "max_size_mb")
    private Integer maxSizeMb;

    @Column(name = "source_url", length = 1000)
    private String sourceUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
