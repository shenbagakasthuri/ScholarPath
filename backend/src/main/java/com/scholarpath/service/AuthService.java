package com.scholarpath.service;

import com.scholarpath.config.JwtTokenProvider;
import com.scholarpath.dto.AuthResponse;
import com.scholarpath.dto.LoginRequest;
import com.scholarpath.dto.RefreshTokenRequest;
import com.scholarpath.dto.RegisterRequest;
import com.scholarpath.entity.User;
import com.scholarpath.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final Set<String> revokedRefreshTokens = ConcurrentHashMap.newKeySet();

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        return buildResponse(accessToken, refreshToken, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        return buildResponse(accessToken, refreshToken, user);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (revokedRefreshTokens.contains(token)) {
            throw new IllegalArgumentException("Refresh token has been revoked");
        }
        if (!jwtTokenProvider.validateRefreshToken(token)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Rotate: revoke old refresh token
        revokedRefreshTokens.add(token);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId().toString(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId().toString());

        return buildResponse(accessToken, refreshToken, user);
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            revokedRefreshTokens.add(refreshToken);
        }
    }

    private AuthResponse buildResponse(String accessToken, String refreshToken, User user) {
        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        return response;
    }
}