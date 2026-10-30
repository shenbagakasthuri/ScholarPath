import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, X, Loader2, Sparkles, MessageSquare, Check, AlertCircle, HelpCircle, Info, Copy } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import styles from './ChatAssistant.module.css';

const mockResponses = {
  greeting: {
    text: "Hello! I'm your ScholarPath Assistant. I can help you discover scholarships that match your profile. To get started, could you tell me a bit about yourself? For example:\n\n• Your current education level (10th, 12th, undergraduate, etc.)\n• Your academic performance (percentage/CGPA)\n• Your family's annual income\n• Your category (General, OBC, SC, ST, EWS, etc.)\n• Your domicile state\n\nYou can type or use voice input. What would you like to share first?",
    suggestions: [
      "I'm a 12th grade student with 92% in CBSE",
      "I'm pursuing B.Tech Computer Science, CGPA 8.7",
      "My family income is ₹6.5 lakhs, I'm OBC from Maharashtra",
      "Show me scholarships for engineering students",
    ],
  },
  education: {
    text: "Thanks for sharing your education details! That's a great academic record. Now, could you tell me about your family's annual income and your category? This helps me find need-based and category-specific scholarships for you.",
    suggestions: [
      "Family income ₹6.5 lakhs, OBC category",
      "Family income ₹3 lakhs, SC category",
      "Family income ₹10 lakhs, General category",
      "I'd rather not share income details",
    ],
  },
  income: {
    text: "Got it! Now, what's your domicile state? Some scholarships are state-specific, so this helps narrow down the options.",
    suggestions: [
      "Maharashtra",
      "Delhi",
      "Karnataka",
      "Tamil Nadu",
      "Other state",
    ],
  },
  complete: {
    text: "Perfect! I have enough information to find relevant scholarships for you. Let me search our database...",
    suggestions: [
      "Show me all matching scholarships",
      "Show only government scholarships",
      "Show scholarships with upcoming deadlines",
      "Explain how matching works",
    ],
  },
  default: {
    text: "I understand. Let me help you find scholarships based on what you've shared so far. Would you like me to search now, or do you have more details to add?",
    suggestions: [
      "Search scholarships now",
      "Add more details about my profile",
      "Explain eligibility criteria",
      "How does the matching work?",
    ],
  },
};

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your ScholarPath Assistant. I can help you discover scholarships that match your profile. To get started, could you tell me a bit about yourself? For example:\n\n• Your current education level (10th, 12th, undergraduate, etc.)\n• Your academic performance (percentage/CGPA)\n• Your family's annual income\n• Your category (General, OBC, SC, ST, EWS, etc.)\n• Your domicile state\n\nYou can type or use voice input. What would you like to share first?",
    suggestions: [
      "I'm a 12th grade student with 92% in CBSE",
      "I'm pursuing B.Tech Computer Science, CGPA 8.7",
      "My family income is ₹6.5 lakhs, I'm OBC from Maharashtra",
      "Show me scholarships for engineering students",
    ],
    timestamp: new Date(),
  },
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getMockResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('12th') || lower.includes('b.tech') || lower.includes('undergraduate') || lower.includes('cgpa') || lower.includes('percentage') || lower.includes('grade')) {
      return mockResponses.education;
    }
    if (lower.includes('income') || lower.includes('lakh') || lower.includes('₹') || lower.includes('earn') || lower.includes('salary')) {
      return mockResponses.income;
    }
    if (lower.includes('maharashtra') || lower.includes('delhi') || lower.includes('karnataka') || lower.includes('tamil') || lower.includes('state') || lower.includes('domicile')) {
      return mockResponses.complete;
    }
    if (lower.includes('search') || lower.includes('find') || lower.includes('show') || lower.includes('scholarship')) {
      return mockResponses.complete;
    }
    return mockResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setShowSuggestions(false);

    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getMockResponse(userMessage);
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.text,
        suggestions: response.suggestions,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const voiceInputs = [
        "I'm a 12th grade student with 92% in CBSE",
        "My family income is ₹6.5 lakhs and I'm OBC from Maharashtra",
        "I'm pursuing B.Tech Computer Science with CGPA 8.7",
        "Show me scholarships for engineering students",
      ];
      const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
      setInputValue(randomInput);
      setIsListening(false);
    }, 2000);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className={styles.title}>ScholarPath Assistant</h3>
            <p className={styles.subtitle}>AI-powered scholarship guidance</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Badge variant="default" size="sm">
            <Info className="w-3 h-3" />
            Demo Mode
          </Badge>
        </div>
      </div>

      <div className={styles.messages} role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={handleCopyMessage}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {showSuggestions && messages.length > 0 && (
        <div className={styles.suggestions}>
          <span className={styles.suggestionsLabel}>Suggestions:</span>
          <div className={styles.suggestionsList}>
            {messages[messages.length - 1].suggestions?.map((suggestion, idx) => (
              <button
                key={idx}
                className={styles.suggestionChip}
                onClick={() => handleSuggestionClick(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <button
            className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
            onClick={handleVoiceInput}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            disabled={isLoading}
          >
            {isListening ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className={styles.voiceText}>Listening...</span>
              </>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <textarea
            ref={inputRef}
            className={styles.textarea}
            placeholder="Type your message... (Shift+Enter for new line)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
            style={{ height: 'auto', minHeight: '48px' }}
          />
          <Button
            className={styles.sendButton}
            variant="primary"
            size="md"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className={styles.hint}>
          Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line. Voice input is simulated in demo mode.
        </p>
      </div>

      <div className={styles.disclaimer}>
        <HelpCircle className="w-4 h-4" />
        <span>
          <strong>Demo Notice:</strong> This is a simulated AI assistant for demonstration purposes. Responses are pre-written and do not use a real LLM API. In production, this would connect to a real AI service with RAG over verified scholarship documents.
        </span>
      </div>
    </div>
  );
}

function MessageBubble({ message, onCopy }) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.messageContent}>
        {!isUser && (
          <div className={styles.avatar}>
            <Sparkles className="w-5 h-5" />
          </div>
        )}
        <div className={styles.bubble}>
          <div className={styles.bubbleHeader}>
            <span className={styles.senderName}>
              {isUser ? 'You' : 'Assistant'}
            </span>
            <span className={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              className={styles.copyButton}
              onClick={() => onCopy(message.content)}
              aria-label="Copy message"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className={styles.bubbleText}>
            {message.content.split('\n').map((line, idx) => (
              <p key={idx} className={styles.paragraph}>{line}</p>
            ))}
          </div>
        </div>
        {isUser && (
          <div className={styles.avatar}>
            <span>U</span>
          </div>
        )}
      </div>
      {message.suggestions && !isUser && (
        <div className={styles.messageSuggestions}>
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className={styles.suggestionChip}
              onClick={() => {
                const event = new CustomEvent('suggestionClick', { detail: suggestion });
                window.dispatchEvent(event);
              }}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className={`${styles.message} ${styles.assistant} ${styles.typing}`}>
      <div className={styles.messageContent}>
        <div className={styles.avatar}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className={styles.bubble} style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
          <div className={styles.typingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}