package com.scholarpath.repository;

import com.scholarpath.entity.Scholarship;
import com.scholarpath.entity.ScholarshipMatch;
import com.scholarpath.entity.StudentProfile;
import com.scholarpath.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ScholarshipMatchRepositoryTest {

    @Autowired
    private ScholarshipMatchRepository scholarshipMatchRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByStudentProfileAndScholarship() {
        User user = User.builder()
                .email("match-user@example.com")
                .passwordHash("hashed")
                .fullName("Match User")
                .role(User.Role.STUDENT)
                .build();

        User savedUser = userRepository.save(user);

        StudentProfile studentProfile = StudentProfile.builder()
                .user(savedUser)
                .category("OBC")
                .domicileState("Karnataka")
                .build();

        StudentProfile savedProfile = studentProfileRepository.save(studentProfile);

        Scholarship scholarship = Scholarship.builder()
                .title("Match Scholarship")
                .slug("match-scholarship")
                .providerName("Provider")
                .academicYear("2024-25")
                .scholarshipType(Scholarship.ScholarshipType.merit)
                .providerType(Scholarship.ProviderType.private_)
                .currency("INR")
                .build();

        Scholarship savedScholarship = scholarshipRepository.save(scholarship);

        ScholarshipMatch scholarshipMatch = ScholarshipMatch.builder()
                .studentProfile(savedProfile)
                .scholarship(savedScholarship)
                .matchScore(new BigDecimal("85.50"))
                .eligibilityStatus("eligible")
                .matchedCriteriaCount(4)
                .totalMandatoryCriteriaCount(5)
                .matchExplanation("Strong fit based on profile")
                .build();

        scholarshipMatchRepository.save(scholarshipMatch);

        assertThat(scholarshipMatchRepository.findByStudentProfileIdAndScholarshipId(
                savedProfile.getId(), savedScholarship.getId()))
                .isPresent();
    }
}
