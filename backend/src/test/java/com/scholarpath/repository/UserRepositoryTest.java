package com.scholarpath.repository;

import com.scholarpath.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindUser() {
        User user = User.builder()
                .email("test@example.com")
                .passwordHash("hashed_password")
                .fullName("Test User")
                .role(User.Role.STUDENT)
                .isActive(true)
                .emailVerified(false)
                .build();

        User saved = userRepository.save(user);
        assertThat(saved.getId()).isNotNull();

        User found = userRepository.findById(saved.getId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo("test@example.com");
        assertThat(found.getRole()).isEqualTo(User.Role.STUDENT);
    }

    @Test
    void findByEmail() {
        User user = User.builder()
                .email("find@example.com")
                .passwordHash("hashed")
                .fullName("Find User")
                .build();
        entityManager.persistAndFlush(user);

        assertThat(userRepository.findByEmail("find@example.com")).isPresent();
        assertThat(userRepository.findByEmail("nonexistent@example.com")).isEmpty();
    }

    @Test
    void existsByEmail() {
        User user = User.builder()
                .email("exists@example.com")
                .passwordHash("hashed")
                .fullName("Exists User")
                .build();
        entityManager.persistAndFlush(user);

        assertThat(userRepository.existsByEmail("exists@example.com")).isTrue();
        assertThat(userRepository.existsByEmail("nope@example.com")).isFalse();
    }
}