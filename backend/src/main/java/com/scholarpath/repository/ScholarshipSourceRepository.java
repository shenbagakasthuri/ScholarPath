package com.scholarpath.repository;

import com.scholarpath.entity.ScholarshipSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipSourceRepository extends JpaRepository<ScholarshipSource, Long> {
    List<ScholarshipSource> findByScholarshipId(Long scholarshipId);
}
