package com.scholarpath.auth;

import com.scholarpath.dto.LoginRequest;
import com.scholarpath.dto.RegisterRequest;
import com.scholarpath.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void registerSuccess() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");
        req.setFullName("Test User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    @Test
    void registerDuplicateEmail() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("dup@example.com");
        req.setPassword("password123");
        req.setFullName("User One");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        req.setFullName("User Two");
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void passwordStoredAsBcrypt() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("bcrypt@example.com");
        req.setPassword("mypassword");
        req.setFullName("Bcrypt User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        var user = userRepository.findByEmail("bcrypt@example.com").orElseThrow();
        org.junit.jupiter.api.Assertions.assertTrue(passwordEncoder.matches("mypassword", user.getPasswordHash()));
        org.junit.jupiter.api.Assertions.assertNotEquals("mypassword", user.getPasswordHash());
    }

    @Test
    void loginSuccess() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("login@example.com");
        reg.setPassword("password123");
        reg.setFullName("Login User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk());

        LoginRequest login = new LoginRequest();
        login.setEmail("login@example.com");
        login.setPassword("password123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void loginWrongPassword() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("wrongpw@example.com");
        reg.setPassword("correctpassword");
        reg.setFullName("Wrong PW User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk());

        LoginRequest login = new LoginRequest();
        login.setEmail("wrongpw@example.com");
        login.setPassword("wrongpassword");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginNonexistentUser() throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail("nonexistent@example.com");
        login.setPassword("password123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void protectedEndpointRejectsUnauthenticated() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk());

        // Use a non-permitted endpoint (none exist yet besides health, but test security config)
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void publicAuthEndpointsAccessible() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("public@example.com");
        req.setPassword("password123");
        req.setFullName("Public User");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void invalidBearerTokenRejected() throws Exception {
        mockMvc.perform(get("/health")
                        .header("Authorization", "Bearer invalid.token.here"))
                .andExpect(status().isOk()); // health is permitted

        mockMvc.perform(get("/api/health")
                        .header("Authorization", "Bearer invalid.token.here"))
                .andExpect(status().isUnauthorized());
    }
}