package com.scholarpath.repository;

import com.scholarpath.entity.ScholarshipRequiredDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipRequiredDocumentRepository extends JpaRepository<ScholarshipRequiredDocument, Long> {
    List<ScholarshipRequiredDocument> findByScholarshipId(Long scholarshipId);
}
