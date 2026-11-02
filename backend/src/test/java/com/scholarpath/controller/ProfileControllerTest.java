package com.scholarpath.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarpath.config.JwtTokenProvider;
import com.scholarpath.dto.EducationalBackgroundRequest;
import com.scholarpath.dto.StudentProfileRequest;
import com.scholarpath.entity.EducationalBackground;
import com.scholarpath.entity.StudentProfile;
import com.scholarpath.entity.User;
import com.scholarpath.repository.EducationalBackgroundRepository;
import com.scholarpath.repository.StudentProfileRepository;
import com.scholarpath.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private EducationalBackgroundRepository educationalBackgroundRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        educationalBackgroundRepository.deleteAll();
        studentProfileRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void authenticatedUserSuccessfullyRetrievesTheirProfile() throws Exception {
        User user = saveUser("me@example.com", "Me User");
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .dateOfBirth(LocalDate.of(2000, 3, 15))
                .gender("FEMALE")
                .category("OBC")
                .domicileState("Tamil Nadu")
                .build();
        studentProfileRepository.save(profile);

        mockMvc.perform(get("/profile")
                        .header("Authorization", "Bearer " + tokenFor(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(user.getId().intValue()))
                .andExpect(jsonPath("$.gender").value("FEMALE"))
                .andExpect(jsonPath("$.domicileState").value("Tamil Nadu"));
    }

    @Test
    void authenticatedUserSuccessfullyUpdatesTheirProfile() throws Exception {
        User user = saveUser("update@example.com", "Update User");
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .domicileState("Karnataka")
                .build();
        studentProfileRepository.save(profile);

        StudentProfileRequest request = new StudentProfileRequest();
        request.setGender("MALE");
        request.setCategory("GENERAL");
        request.setSubCategory("GEN");
        request.setDisabilityPercentage(0);
        request.setAnnualFamilyIncome(new BigDecimal("500000.00"));
        request.setDomicileState("Kerala");
        request.setDomicileDistrict("Thrissur");
        request.setBankAccountNumber("1234567890");
        request.setBankIfscCode("SBIN0001234");
        request.setBankAccountHolderName("Update User");

        mockMvc.perform(put("/profile")
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gender").value("MALE"))
                .andExpect(jsonPath("$.category").value("GENERAL"))
                .andExpect(jsonPath("$.domicileState").value("Kerala"));
    }

    @Test
    void missingProfileReturnsNotFound() throws Exception {
        User user = saveUser("missing@example.com", "Missing User");

        mockMvc.perform(get("/profile")
                        .header("Authorization", "Bearer " + tokenFor(user)))
                .andExpect(status().isNotFound());
    }

    @Test
    void invalidInputReturnsBadRequest() throws Exception {
        User user = saveUser("invalid@example.com", "Invalid User");
        StudentProfile profile = StudentProfile.builder().user(user).build();
        studentProfileRepository.save(profile);

        StudentProfileRequest request = new StudentProfileRequest();
        request.setDisabilityPercentage(-1);
        request.setAnnualFamilyIncome(new BigDecimal("-100.00"));
        request.setDateOfBirth(LocalDate.now().plusDays(1));

        mockMvc.perform(put("/profile")
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unauthenticatedAccessReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void oneUserCannotAccessOrUpdateAnotherUsersProfile() throws Exception {
        User userA = saveUser("a@example.com", "User A");
        User userB = saveUser("b@example.com", "User B");
        StudentProfile bProfile = StudentProfile.builder()
                .user(userB)
                .category("SC")
                .domicileState("Tamil Nadu")
                .build();
        studentProfileRepository.save(bProfile);

        mockMvc.perform(get("/profile")
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isNotFound());

        StudentProfileRequest request = new StudentProfileRequest();
        request.setGender("FEMALE");
        request.setCategory("GENERAL");
        request.setDomicileState("Maharashtra");

        mockMvc.perform(put("/profile")
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        StudentProfile savedBProfile = studentProfileRepository.findByUserId(userB.getId()).orElseThrow();
        assertThat(savedBProfile.getCategory()).isEqualTo("SC");
        assertThat(savedBProfile.getDomicileState()).isEqualTo("Tamil Nadu");

        StudentProfile savedAProfile = studentProfileRepository.findByUserId(userA.getId()).orElseThrow();
        assertThat(savedAProfile.getCategory()).isEqualTo("GENERAL");
        assertThat(savedAProfile.getDomicileState()).isEqualTo("Maharashtra");
    }

    @Test
    void authenticatedUserCanCreateEducationRecord() throws Exception {
        User user = saveUser("edu.create@example.com", "Education User");
        StudentProfile profile = saveProfile(user, "Tamil Nadu");

        EducationalBackgroundRequest request = new EducationalBackgroundRequest();
        request.setLevel("UG");
        request.setInstitutionName("University of Madras");
        request.setBoardUniversity("University of Madras");
        request.setCourseName("B.Sc Computer Science");
        request.setStream("Computer Science");
        request.setYearOfPassing(2024);
        request.setPercentageCgpa(new BigDecimal("87.50"));
        request.setIsCurrent(false);

        mockMvc.perform(post("/profile/education")
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.studentProfileId").value(profile.getId().intValue()))
                .andExpect(jsonPath("$.institutionName").value("University of Madras"))
                .andExpect(jsonPath("$.level").value("UG"));
    }

    @Test
    void listReturnsOnlyAuthenticatedUsersEducationRecords() throws Exception {
        User userA = saveUser("usera@example.com", "User A");
        User userB = saveUser("userb@example.com", "User B");
        StudentProfile profileA = saveProfile(userA, "Tamil Nadu");
        StudentProfile profileB = saveProfile(userB, "Karnataka");

        educationalBackgroundRepository.save(EducationalBackground.builder()
                .studentProfile(profileA)
                .level("UG")
                .institutionName("A College")
                .courseName("B.Tech")
                .isCurrent(false)
                .build());
        educationalBackgroundRepository.save(EducationalBackground.builder()
                .studentProfile(profileB)
                .level("UG")
                .institutionName("B College")
                .courseName("B.Com")
                .isCurrent(false)
                .build());

        mockMvc.perform(get("/profile/education")
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].institutionName").value("A College"));
    }

    @Test
    void authenticatedUserCanUpdateOwnedEducationRecord() throws Exception {
        User user = saveUser("edu.update@example.com", "Education Update");
        StudentProfile profile = saveProfile(user, "Gujarat");
        EducationalBackground record = educationalBackgroundRepository.save(EducationalBackground.builder()
                .studentProfile(profile)
                .level("UG")
                .institutionName("Old College")
                .courseName("Old Course")
                .isCurrent(false)
                .build());

        EducationalBackgroundRequest request = new EducationalBackgroundRequest();
        request.setLevel("PG");
        request.setInstitutionName("New University");
        request.setBoardUniversity("New University");
        request.setCourseName("M.Sc Data Science");
        request.setStream("Data Science");
        request.setYearOfPassing(2026);
        request.setPercentageCgpa(new BigDecimal("91.00"));
        request.setIsCurrent(true);

        mockMvc.perform(put("/profile/education/{id}", record.getId())
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.level").value("PG"))
                .andExpect(jsonPath("$.institutionName").value("New University"))
                .andExpect(jsonPath("$.isCurrent").value(true));
    }

    @Test
    void oneUserCannotUpdateAnotherUsersEducationRecord() throws Exception {
        User userA = saveUser("usera2@example.com", "User A2");
        User userB = saveUser("userb2@example.com", "User B2");
        saveProfile(userA, "Tamil Nadu");
        StudentProfile profileB = saveProfile(userB, "Maharashtra");
        EducationalBackground otherUsersRecord = educationalBackgroundRepository.save(EducationalBackground.builder()
                .studentProfile(profileB)
                .level("UG")
                .institutionName("Other College")
                .courseName("B.A")
                .isCurrent(false)
                .build());

        EducationalBackgroundRequest request = new EducationalBackgroundRequest();
        request.setLevel("PG");
        request.setInstitutionName("Hacked College");
        request.setCourseName("M.A");
        request.setIsCurrent(false);

        mockMvc.perform(put("/profile/education/{id}", otherUsersRecord.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());

        EducationalBackground persisted = educationalBackgroundRepository.findById(otherUsersRecord.getId()).orElseThrow();
        assertThat(persisted.getInstitutionName()).isEqualTo("Other College");
    }

    @Test
    void unauthenticatedEducationRequestReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/profile/education"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidEducationRequestReturnsBadRequest() throws Exception {
        User user = saveUser("edu.invalid@example.com", "Invalid Education User");
        saveProfile(user, "Tamil Nadu");

        EducationalBackgroundRequest request = new EducationalBackgroundRequest();
        request.setLevel("");
        request.setInstitutionName("");
        request.setIsCurrent(null);
        request.setPercentageCgpa(new BigDecimal("101.00"));

        mockMvc.perform(post("/profile/education")
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void missingStudentProfileReturnsNotFoundForEducationEndpoints() throws Exception {
        User user = saveUser("no.profile@example.com", "No Profile User");

        mockMvc.perform(get("/profile/education")
                        .header("Authorization", "Bearer " + tokenFor(user)))
                .andExpect(status().isNotFound());
    }

    @Test
    void missingEducationRecordReturnsNotFound() throws Exception {
        User user = saveUser("missing.edu@example.com", "Missing Education User");
        saveProfile(user, "West Bengal");

        EducationalBackgroundRequest request = new EducationalBackgroundRequest();
        request.setLevel("UG");
        request.setInstitutionName("Test Institute");
        request.setIsCurrent(false);

        mockMvc.perform(put("/profile/education/99999")
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    private User saveUser(String email, String fullName) {
        User user = User.builder()
                .email(email)
                .passwordHash("hashed_password")
                .fullName(fullName)
                .role(User.Role.STUDENT)
                .build();
        return userRepository.save(user);
    }

    private StudentProfile saveProfile(User user, String domicileState) {
        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .domicileState(domicileState)
                .build();
        return studentProfileRepository.save(profile);
    }

    private String tokenFor(User user) {
        return jwtTokenProvider.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
    }
}
