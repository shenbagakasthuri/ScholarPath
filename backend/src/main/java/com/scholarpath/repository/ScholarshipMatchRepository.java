package com.scholarpath.repository;

import com.scholarpath.entity.ScholarshipMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScholarshipMatchRepository extends JpaRepository<ScholarshipMatch, Long> {
    List<ScholarshipMatch> findByStudentProfileId(Long studentProfileId);
    List<ScholarshipMatch> findByScholarshipId(Long scholarshipId);
    Optional<ScholarshipMatch> findByStudentProfileIdAndScholarshipId(Long studentProfileId, Long scholarshipId);
}
