package com.scholarpath.repository;

import com.scholarpath.entity.Scholarship;
import com.scholarpath.entity.ScholarshipSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ScholarshipSourceRepositoryTest {

    @Autowired
    private ScholarshipSourceRepository scholarshipSourceRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Test
    void saveAndFindByScholarshipId() {
        Scholarship scholarship = Scholarship.builder()
                .title("Source Scholarship")
                .slug("source-scholarship")
                .providerName("Provider")
                .academicYear("2024-25")
                .scholarshipType(Scholarship.ScholarshipType.need)
                .providerType(Scholarship.ProviderType.state)
                .currency("INR")
                .build();

        Scholarship savedScholarship = scholarshipRepository.save(scholarship);

        ScholarshipSource source = ScholarshipSource.builder()
                .scholarship(savedScholarship)
                .sourceType("OFFICIAL")
                .sourceUrl("https://example.com/official")
                .sourceTitle("Official Notice")
                .isOfficial(true)
                .verificationStatus("VERIFIED")
                .build();

        scholarshipSourceRepository.save(source);

        assertThat(scholarshipSourceRepository.findByScholarshipId(savedScholarship.getId())).hasSize(1);
    }
}
