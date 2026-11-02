package com.scholarpath.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholarpath.config.JwtTokenProvider;
import com.scholarpath.dto.StudentProfileRequest;
import com.scholarpath.entity.StudentProfile;
import com.scholarpath.entity.User;
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
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
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

    private User saveUser(String email, String fullName) {
        User user = User.builder()
                .email(email)
                .passwordHash("hashed_password")
                .fullName(fullName)
                .role(User.Role.STUDENT)
                .build();
        return userRepository.save(user);
    }

    private String tokenFor(User user) {
        return jwtTokenProvider.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
    }
}
