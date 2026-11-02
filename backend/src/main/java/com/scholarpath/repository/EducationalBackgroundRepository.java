package com.scholarpath.repository;

import com.scholarpath.entity.EducationalBackground;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationalBackgroundRepository extends JpaRepository<EducationalBackground, Long> {
    List<EducationalBackground> findByStudentProfileId(Long studentProfileId);
    List<EducationalBackground> findByStudentProfileIdAndIsCurrent(Long studentProfileId, Boolean isCurrent);
}