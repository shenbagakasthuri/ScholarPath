package com.scholarpath.repository;

import com.scholarpath.entity.ScholarshipEligibilityCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipEligibilityCriteriaRepository extends JpaRepository<ScholarshipEligibilityCriteria, Long> {
    List<ScholarshipEligibilityCriteria> findByScholarshipId(Long scholarshipId);
    List<ScholarshipEligibilityCriteria> findByScholarshipIdAndIsMandatory(Long scholarshipId, Boolean isMandatory);
}