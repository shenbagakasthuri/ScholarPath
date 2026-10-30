# BACKEND_IMPLEMENTATION_PLAN.md — ScholarPath Backend Phase 1

## 1. Table-to-Entity Mapping

### Existing Tables (from V1__initial_schema.sql)

| Table | Entity Name | Package | Priority |
|-------|-------------|---------|----------|
| `users` | `User` | `entity` | P1 (Auth) |
| `student_profiles` | `StudentProfile` | `entity` | P1 (Profile) |
| `educational_backgrounds` | `EducationalBackground` | `entity` | P1 (Profile) |
| `scholarships` | `Scholarship` | `entity` | P1 (Core) |
| `scholarship_eligibility_criteria` | `ScholarshipEligibilityCriteria` | `entity` | P2 (Matching) |
| `scholarship_required_documents` | `ScholarshipRequiredDocument` | `entity` | P2 (Details) |
| `scholarship_sources` | `ScholarshipSource` | `entity` | P2 (Verification) |
| `scholarship_matches` | `ScholarshipMatch` | `entity` | P2 (Matching) |
| `conversations` | `Conversation` | `entity` | P3 (AI) |
| `messages` | `Message` | `entity` | P3 (AI) |
| `refresh_tokens` | `RefreshToken` | `entity` | P1 (Auth) |

### Tables Not Needed for Phase 1
- `scholarship_categories` — Not in schema (may be added later)
- `scholarship_providers` — Not in schema (provider info embedded in `scholarships`)

---

## 2. Entity Relationships

### User (1:1) → StudentProfile
- `User.id` → `StudentProfile.user_id` (FK, CASCADE DELETE)
- One user has exactly one student profile

### StudentProfile (1:N) → EducationalBackground
- `StudentProfile.id` → `EducationalBackground.student_profile_id` (FK, CASCADE DELETE)
- One student can have multiple educational backgrounds

### Scholarship (1:N) → ScholarshipEligibilityCriteria
- `Scholarship.id` → `ScholarshipEligibilityCriteria.scholarship_id` (FK, CASCADE DELETE)

### Scholarship (1:N) → ScholarshipRequiredDocument
- `Scholarship.id` → `ScholarshipRequiredDocument.scholarship_id` (FK, CASCADE DELETE)

### Scholarship (1:N) → ScholarshipSource
- `Scholarship.id` → `ScholarshipSource.scholarship_id` (FK, CASCADE DELETE)

### StudentProfile (N:M) → Scholarship (via ScholarshipMatch)
- `ScholarshipMatch.student_profile_id` → `StudentProfile.id`
- `ScholarshipMatch.scholarship_id` → `Scholarship.id`
- Unique constraint on (student_profile_id, scholarship_id)

### User (1:N) → Conversation
- `Conversation.user_id` → `User.id`

### Conversation (1:N) → Message
- `Message.conversation_id` → `Conversation.id`

### User (1:N) → RefreshToken
- `RefreshToken.user_id` → `User.id`

---

## 3. Enum Fields (String-based in DB, Java enums recommended)

| Table | Field | Enum Values |
|-------|-------|-------------|
| `users` | `role` | STUDENT, ADMIN |
| `scholarships` | `provider_type` | government, state, central, university, private, ngo, corporate, international |
| `scholarships` | `scholarship_type` | merit, need, merit_need, sports, minority, disability, women, general |
| `scholarships` | `frequency` | Annual, One-time, Monthly, Semester |
| `scholarships` | `application_mode` | Online, Offline, Both |
| `scholarships` | `verification_status` | PENDING, VERIFIED, DEMO_DATA |
| `scholarship_eligibility_criteria` | `criteria_type` | course, state, income, marks, category, gender, age, disability, year_of_study |
| `scholarship_eligibility_criteria` | `operator` | EQUALS, IN, LTE, GTE, BETWEEN, CONTAINS |
| `scholarship_sources` | `source_type` | OFFICIAL, DEMO, THIRD_PARTY |
| `scholarship_sources` | `verification_status` | VERIFIED, PENDING, DEMO_DATA |
| `scholarship_matches` | `eligibility_status` | eligible, potentially-eligible, ineligible, needs-verification |
| `conversations` | `status` | ACTIVE, ARCHIVED, DELETED |
| `messages` | `role` | user, assistant, system |

---

## 4. Minimum Entities for First Working Application (Phase 1)

### Phase 1 Entities (5 core)
1. **User** — Authentication and identity
2. **StudentProfile** — Student demographic and eligibility data
3. **EducationalBackground** — Academic history (marks, course, institution)
4. **Scholarship** — Scholarship records
5. **ScholarshipEligibilityCriteria** — Structured eligibility rules

### Phase 2 Entities (add later)
6. **ScholarshipSource** — Source URLs and verification
7. **ScholarshipRequiredDocument** — Required documents
8. **ScholarshipMatch** — Cached match results
9. **Conversation** + **Message** — AI assistant
10. **RefreshToken** — JWT refresh

---

## 5. Package Structure (Proposed)

```
com.scholarpath/
├── ScholarPathApplication.java
├── config/
│   ├── CorsConfig.java          (exists)
│   ├── SecurityConfig.java      (exists)
│   └── OpenApiConfig.java       (new)
├── entity/
│   ├── User.java
│   ├── StudentProfile.java
│   ├── EducationalBackground.java
│   ├── Scholarship.java
│   ├── ScholarshipEligibilityCriteria.java
│   ├── ScholarshipSource.java
│   ├── ScholarshipRequiredDocument.java
│   ├── ScholarshipMatch.java
│   ├── Conversation.java
│   ├── Message.java
│   └── RefreshToken.java
├── repository/
│   ├── UserRepository.java
│   ├── StudentProfileRepository.java
│   ├── EducationalBackgroundRepository.java
│   ├── ScholarshipRepository.java
│   ├── ScholarshipEligibilityCriteriaRepository.java
│   ├── ScholarshipSourceRepository.java
│   ├── ScholarshipRequiredDocumentRepository.java
│   ├── ScholarshipMatchRepository.java
│   ├── ConversationRepository.java
│   ├── MessageRepository.java
│   └── RefreshTokenRepository.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ProfileService.java
│   ├── ScholarshipService.java
│   ├── EligibilityService.java
│   ├── MatchService.java
│   └── AssistantService.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── ProfileController.java
│   ├── ScholarshipController.java
│   ├── EligibilityController.java
│   └── AssistantController.java
├── dto/
│   ├── request/ (RegisterRequest, LoginRequest, ProfileRequest, etc.)
│   └── response/ (AuthResponse, ProfileResponse, ScholarshipResponse, etc.)
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── BadRequestException.java
├── health/
│   └── HealthController.java (exists)
└── util/
    └── ScholarshipMapper.java  (entity ↔ DTO conversion)
```

---

## 6. API Endpoint Plan

### Auth (Phase 2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, return JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke refresh token |

### Users (Phase 2)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update user details |

### Profile (Phase 3)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get student profile |
| PUT | `/api/profile` | Create/update student profile |
| GET | `/api/profile/education` | List educational backgrounds |
| POST | `/api/profile/education` | Add educational background |
| PUT | `/api/profile/education/{id}` | Update educational background |
| DELETE | `/api/profile/education/{id}` | Delete educational background |

### Scholarships (Phase 4)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scholarships` | List with pagination, search, filters |
| GET | `/api/scholarships/{id}` | Get scholarship details |
| GET | `/api/scholarships/{id}/criteria` | Get eligibility criteria |
| GET | `/api/scholarships/{id}/documents` | Get required documents |
| GET | `/api/scholarships/{id}/sources` | Get sources |

### Eligibility (Phase 5)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/eligibility/check` | Check single scholarship |
| POST | `/api/eligibility/check-all` | Check all scholarships for user |
| GET | `/api/eligibility/matches` | Get cached match results |

### Assistant (Phase 7)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assistant/chat` | Send message, get AI response |
| GET | `/api/assistant/conversations` | List conversations |
| GET | `/api/assistant/conversations/{id}` | Get conversation history |

### Health (Exists)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (no auth required) |

---

## 7. Implementation Phases

### Phase 1: Entity & Repository Layer
- Create all 5 core entities (User, StudentProfile, EducationalBackground, Scholarship, ScholarshipEligibilityCriteria)
- Create Spring Data JPA repositories
- Add `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@ManyToOne`, `@OneToMany` annotations
- Use `ddl-auto: validate` (schema already exists in Flyway)
- **Test**: Repository integration tests with H2

### Phase 2: Authentication
- Implement User registration with BCrypt password hashing
- Implement login with JWT token generation
- Add JWT authentication filter to Spring Security
- Implement refresh token rotation
- **Test**: Auth controller integration tests

### Phase 3: Profile Management
- Profile CRUD (create/update/get)
- Educational background CRUD
- **Test**: Profile service unit tests + controller integration tests

### Phase 4: Scholarship APIs
- Seed demo scholarships (reuse frontend mock data, import via Flyway or DataLoader)
- Listing with pagination and search
- Filtering by type, provider, state
- Detail view with criteria, documents, sources
- **Test**: Scholarship controller integration tests

### Phase 5: Eligibility Engine (Java port of JS logic)
- Port `scholarshipMatcher.js` logic to Java
- `parseAcademicMarks`, `checkCourseMatch`, `checkStateMatch`, `checkIncomeMatch`, `checkMarksMatch`
- Match student profile against all scholarships
- Return status, score, reasons
- **Test**: Unit tests matching frontend test cases (147 tests to port)

### Phase 6: Frontend-Backend Integration
- Create API client in frontend
- Auth context with JWT storage
- Connect Dashboard, Scholarships, Profile to real APIs
- Protected routes
- **Test**: E2E smoke tests

### Phase 7: AI Assistant
- LLM API integration (OpenAI/Anthropic)
- Conversation management
- RAG preparation (scholarship context injection)
- **Test**: Assistant service tests with mocked LLM

### Phase 8: Testing & Polish
- Integration tests for all endpoints
- Security audit
- Error handling and validation
- Responsive design verification
- README update

---

## 8. Testing Strategy

### Current Setup
- **Unit tests**: JUnit 5 + Spring Boot Test
- **Database**: H2 in-memory (test profile) — MySQL for production
- **Flyway**: Disabled in tests (H2 schema via Hibernate `ddl-auto: create-drop`)
- **Security**: Spring Security with test config

### Test Layers
1. **Unit Tests**: Service logic (eligibility engine, parsing, matching)
2. **Repository Tests**: `@DataJpaTest` with H2 — verify entity mappings and queries
3. **Controller Tests**: `@WebMvcTest` with MockMvc — verify HTTP contracts
4. **Integration Tests**: `@SpringBootTest` with H2 — full flow testing

### MySQL Compatibility Notes
- H2 in `MODE=MySQL` for syntax compatibility
- Use `@Sql` scripts for test data setup
- Flyway migrations validated against MySQL in CI/CD (future)
- Production uses MySQL with `ddl-auto: validate`

### Test Data Strategy
- Reuse frontend demo scholarship data (3 records) as seed data
- Create test student profiles matching frontend test profiles
- Port 147 frontend test cases to Java JUnit tests

---

## 9. Frontend-Backend Data Model Mismatch

### Field Name Differences

| Frontend (JS) | Backend (DB) | Notes |
|---------------|--------------|-------|
| `course` | `educational_backgrounds.course_name` | Frontend is a string; backend has separate table |
| `academicMarks` | `educational_backgrounds.percentage_cgpa` | Frontend parses "85%" or "8.7 CGPA"; backend stores as DECIMAL |
| `incomeRange` (e.g., "500000-800000") | `student_profiles.annual_family_income` (DECIMAL) | Frontend uses range string; backend uses exact value |
| `state` (e.g., "maharashtra") | `student_profiles.domicile_state` | Frontend uses slug; backend uses full name |
| `minimumMarks` (e.g., "75% or 7.5 CGPA") | `scholarship_eligibility_criteria` rows | Frontend parses string; backend has structured criteria |
| `eligibleCourses` (array) | `scholarship_eligibility_criteria` with criteria_key="course" | Frontend has flat array; backend has normalized criteria |
| `eligibleStates` (array) | `scholarship_eligibility_criteria` with criteria_key="state" | Same as above |
| `incomeLimit` (number) | `scholarship_eligibility_criteria` with criteria_key="income" | Same as above |
| `provider` | `scholarships.provider_name` | Direct mapping |
| `deadline` | `scholarships.application_end_date` | Direct mapping |
| `isVerified` + `verificationStatus` | `scholarships.is_verified` + `scholarships.verification_status` | Direct mapping |

### Key Mismatches to Resolve
1. **Income format**: Frontend uses range strings ("500000-800000"); backend uses exact DECIMAL. Need conversion layer.
2. **State format**: Frontend uses slug ("maharashtra"); backend uses full name ("Maharashtra"). Need mapping or standardization.
3. **Marks format**: Frontend parses "85%" or "8.7 CGPA"; backend stores as DECIMAL with type indicator. Need parsing in both directions.
4. **Eligibility criteria**: Frontend has flat arrays (eligibleCourses, eligibleStates); backend has normalized criteria table. Need transformation in API layer.
5. **Scholarship ID**: Frontend uses string IDs ("demo-001"); backend uses auto-increment BIGINT. Need ID mapping or use slug as external ID.

### Recommendation
- Use `slug` as the frontend-facing identifier (already unique in DB)
- Create DTOs that transform between frontend format and backend entities
- Income range → exact value conversion in ProfileService
- State slug → full name mapping in a utility class
- Marks parsing in both directions (reuse frontend logic in Java)

---

## 10. Risks and Unresolved Decisions

### Risks
1. **MySQL not installed** — Development uses H2; production requires MySQL installation. Mitigation: H2 in MySQL compatibility mode for tests.
2. **Schema complexity** — 11 tables with FKs; entity mapping must be precise. Mitigation: Start with 5 core entities, add others incrementally.
3. **Frontend-backend sync** — Frontend matching engine is in JS; backend eligibility must produce identical results. Mitigation: Port all 147 test cases to Java.
4. **No version control** — No git repo; changes cannot be easily reverted. Mitigation: Work in small, testable increments.
5. **Security defaults** — JWT secret and DB password have weak defaults. Mitigation: Document required env vars, use strong defaults in production.

### Unresolved Decisions
1. **Auth approach**: JWT (stateless) vs Session-based? → Recommend JWT (already have dependencies)
2. **AI provider**: OpenAI vs Anthropic? → Keep both configurable, default to OpenAI
3. **Scholarship data source**: Seed from frontend mock data vs create new? → Seed from frontend mock data for consistency
4. **Profile storage**: Single profile per user vs multiple? → Single profile per user (matches frontend)
5. **Eligibility caching**: Cache match results in DB vs compute on demand? → Cache in scholarship_matches table
6. **Admin panel**: Separate admin UI vs API-only? → API-only for now, admin UI later

---

## 11. Files to Create (Phase 1 — Entities & Repositories)

### Entities (5 core)
1. `src/main/java/com/scholarpath/entity/User.java`
2. `src/main/java/com/scholarpath/entity/StudentProfile.java`
3. `src/main/java/com/scholarpath/entity/EducationalBackground.java`
4. `src/main/java/com/scholarpath/entity/Scholarship.java`
5. `src/main/java/com/scholarpath/entity/ScholarshipEligibilityCriteria.java`

### Repositories (5 core)
6. `src/main/java/com/scholarpath/repository/UserRepository.java`
7. `src/main/java/com/scholarpath/repository/StudentProfileRepository.java`
8. `src/main/java/com/scholarpath/repository/EducationalBackgroundRepository.java`
9. `src/main/java/com/scholarpath/repository/ScholarshipRepository.java`
10. `src/main/java/com/scholarpath/repository/ScholarshipEligibilityCriteriaRepository.java`

### Tests
11. `src/test/java/com/scholarpath/repository/*RepositoryTest.java`

### Configuration (no changes needed)
- `application.yml` — MySQL config already present
- `application-test.yml` — H2 config already present
- `pom.xml` — H2 dependency already added

---

*Waiting for approval before implementing Phase 1.*