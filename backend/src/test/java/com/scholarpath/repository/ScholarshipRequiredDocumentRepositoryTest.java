package com.scholarpath.repository;

import com.scholarpath.entity.Scholarship;
import com.scholarpath.entity.ScholarshipRequiredDocument;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ScholarshipRequiredDocumentRepositoryTest {

    @Autowired
    private ScholarshipRequiredDocumentRepository scholarshipRequiredDocumentRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Test
    void saveAndFindByScholarshipId() {
        Scholarship scholarship = Scholarship.builder()
                .title("Document Scholarship")
                .slug("document-scholarship")
                .providerName("Provider")
                .academicYear("2024-25")
                .scholarshipType(Scholarship.ScholarshipType.merit)
                .providerType(Scholarship.ProviderType.government)
                .currency("INR")
                .build();

        Scholarship savedScholarship = scholarshipRepository.save(scholarship);

        ScholarshipRequiredDocument document = ScholarshipRequiredDocument.builder()
                .scholarship(savedScholarship)
                .documentName("Marksheet")
                .documentDescription("Latest marksheet")
                .isMandatory(true)
                .acceptedFormats("PDF,JPG")
                .maxSizeMb(5)
                .build();

        scholarshipRequiredDocumentRepository.save(document);

        assertThat(scholarshipRequiredDocumentRepository.findByScholarshipId(savedScholarship.getId())).hasSize(1);
    }
}
