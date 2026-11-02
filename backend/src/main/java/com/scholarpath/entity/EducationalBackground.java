package com.scholarpath.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "educational_backgrounds", indexes = {
    @Index(name = "idx_educational_backgrounds_student_profile_id", columnList = "student_profile_id"),
    @Index(name = "idx_educational_backgrounds_level", columnList = "level"),
    @Index(name = "idx_educational_backgrounds_is_current", columnList = "is_current")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationalBackground {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(name = "level", nullable = false, length = 50)
    private String level;

    @Column(name = "institution_name", nullable = false, length = 255)
    private String institutionName;

    @Column(name = "board_university", length = 255)
    private String boardUniversity;

    @Column(name = "course_name", length = 255)
    private String courseName;

    @Column(name = "stream", length = 100)
    private String stream;

    @Column(name = "year_of_passing")
    private Integer yearOfPassing;

    @Column(name = "percentage_cgpa", precision = 5, scale = 2)
    private BigDecimal percentageCgpa;

    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private Boolean isCurrent = false;

    @Column(name = "marksheet_url", length = 500)
    private String marksheetUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}