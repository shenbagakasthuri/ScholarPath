package com.scholarpath.repository;

import com.scholarpath.entity.Conversation;
import com.scholarpath.entity.Message;
import com.scholarpath.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByConversationId() {
        User user = User.builder()
                .email("message-user@example.com")
                .passwordHash("hashed")
                .fullName("Message User")
                .build();

        User savedUser = userRepository.save(user);

        Conversation conversation = Conversation.builder()
                .user(savedUser)
                .sessionId("message-session")
                .title("Chat")
                .status("ACTIVE")
                .build();

        Conversation savedConversation = conversationRepository.save(conversation);

        Message message = Message.builder()
                .conversation(savedConversation)
                .role("user")
                .content("Find scholarships for engineering")
                .tokenCount(7)
                .build();

        messageRepository.save(message);

        assertThat(messageRepository.findByConversationId(savedConversation.getId())).hasSize(1);
    }
}
