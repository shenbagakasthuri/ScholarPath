package com.scholarpath.repository;

import com.scholarpath.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    Optional<Scholarship> findBySlug(String slug);
    boolean existsBySlug(String slug);
}