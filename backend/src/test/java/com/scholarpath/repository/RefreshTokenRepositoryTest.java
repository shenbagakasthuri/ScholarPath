package com.scholarpath.repository;

import com.scholarpath.entity.RefreshToken;
import com.scholarpath.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RefreshTokenRepositoryTest {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByToken() {
        User user = User.builder()
                .email("refresh-user@example.com")
                .passwordHash("hashed")
                .fullName("Refresh User")
                .build();

        User savedUser = userRepository.save(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(savedUser)
                .token("sample-refresh-token")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        assertThat(refreshTokenRepository.findByToken("sample-refresh-token")).isPresent();
        assertThat(refreshTokenRepository.findByUserId(savedUser.getId())).hasSize(1);
    }
}
