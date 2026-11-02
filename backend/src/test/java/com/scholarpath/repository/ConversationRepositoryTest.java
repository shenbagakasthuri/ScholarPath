package com.scholarpath.repository;

import com.scholarpath.entity.Conversation;
import com.scholarpath.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ConversationRepositoryTest {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByUserAndSession() {
        User user = User.builder()
                .email("conversation-user@example.com")
                .passwordHash("hashed")
                .fullName("Conversation User")
                .build();

        User savedUser = userRepository.save(user);

        Conversation conversation = Conversation.builder()
                .user(savedUser)
                .sessionId("session-123")
                .title("Scholarship Search")
                .status("ACTIVE")
                .build();

        conversationRepository.save(conversation);

        assertThat(conversationRepository.findByUserId(savedUser.getId())).hasSize(1);
        assertThat(conversationRepository.findByUserIdAndSessionId(savedUser.getId(), "session-123")).isPresent();
    }
}
