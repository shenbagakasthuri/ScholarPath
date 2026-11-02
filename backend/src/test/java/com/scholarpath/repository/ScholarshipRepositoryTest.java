package com.scholarpath.repository;

import com.scholarpath.entity.Scholarship;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ScholarshipRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Test
    void saveAndFindScholarship() {
        Scholarship scholarship = Scholarship.builder()
                .title("Test Scholarship")
                .slug("test-scholarship")
                .providerName("Test Provider")
                .providerType(Scholarship.ProviderType.private_)
                .academicYear("2024-25")
                .scholarshipType(Scholarship.ScholarshipType.merit)
                .currency("INR")
                .isActive(true)
                .isVerified(false)
                .verificationStatus(Scholarship.VerificationStatus.DEMO_DATA)
                .build();

        Scholarship saved = scholarshipRepository.save(scholarship);
        assertThat(saved.getId()).isNotNull();

        Scholarship found = scholarshipRepository.findBySlug("test-scholarship").orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getTitle()).isEqualTo("Test Scholarship");
        assertThat(found.getVerificationStatus()).isEqualTo(Scholarship.VerificationStatus.DEMO_DATA);
    }

    @Test
    void existsBySlug() {
        Scholarship scholarship = Scholarship.builder()
                .title("Exists Scholarship")
                .slug("exists-slug")
                .providerName("Provider")
                .providerType(Scholarship.ProviderType.government)
                .academicYear("2024-25")
                .scholarshipType(Scholarship.ScholarshipType.need)
                .build();
        entityManager.persistAndFlush(scholarship);

        assertThat(scholarshipRepository.existsBySlug("exists-slug")).isTrue();
        assertThat(scholarshipRepository.existsBySlug("nope")).isFalse();
    }
}