# PRE_INTEGRATION_REPORT.md — ScholarPath Frontend-Backend Integration Readiness

## 1. Phase 1 Backend Entities

### Implemented (5 of 11 schema tables)
| Entity | File | Repository |
|--------|------|------------|
| User | `entity/User.java` | `UserRepository` |
| StudentProfile | `entity/StudentProfile.java` | `StudentProfileRepository` |
| EducationalBackground | `entity/EducationalBackground.java` | `EducationalBackgroundRepository` |
| Scholarship | `entity/Scholarship.java` | `ScholarshipRepository` |
| ScholarshipEligibilityCriteria | `entity/ScholarshipEligibilityCriteria.java` | `ScholarshipEligibilityCriteriaRepository` |

### Missing (6 of 11 schema tables)
- `scholarship_required_documents` — no entity/repository
- `scholarship_sources` — no entity/repository
- `scholarship_matches` — no entity/repository
- `conversations` — no entity/repository
- `messages` — no entity/repository
- `refresh_tokens` — no entity/repository (auth uses in-memory revocation)

**Recommendation:** Phase 1 is incomplete. Complete remaining entities (especially `scholarship_matches`, `conversations`, `messages`, `refresh_tokens`) before full integration. The `refresh_tokens` table should back the auth revocation store.

## 2. Entity-to-Schema Mapping

The 5 implemented entities map to their corresponding tables. Field-level mapping verified via H2 `create-drop` tests. Remaining 6 tables have no JPA representation.

## 3. H2 Test Status

- `HealthControllerTest`: 1 pass
- `ScholarshipRepositoryTest`: 2 pass
- `UserRepositoryTest`: 3 pass
- `AuthControllerTest`: 9 pass
- Total: 15/15 pass
- H2 in MySQL compatibility mode (MODE=MySQL) for tests; Flyway disabled; ddl-auto=create-drop

## 4. Authentication API

Base URL: `http://localhost:8080/api`

| Endpoint | Method | Auth | Request | Response |
|----------|--------|------|---------|----------|
| `/auth/register` | POST | Public | `{email, password, fullName}` | `{accessToken, refreshToken, tokenType, userId, email, role}` |
| `/auth/login` | POST | Public | `{email, password}` | Same as register |
| `/auth/refresh` | POST | Public | `{refreshToken}` | Same as register (rotated tokens) |
| `/auth/logout` | POST | Public | `{refreshToken}` | 200 OK (empty) |
| `/health` | GET | Public | — | `{status, service, timestamp}` |

- Access token expires in 24h; refresh token in 7d
- Tokens use `token_type` claim; filter accepts only access tokens
- Rate limit: 10 req/min per IP per auth endpoint (429 on exceed)
- BCrypt password hashing

## 5. Frontend Authentication State

- **No auth pages exist** (no Login.jsx, Register.jsx)
- **No auth context** (context/ directory is empty)
- **No API client** (no services/ directory)
- **No token storage** (localStorage only used for profile data)
- **No protected routes** (all routes public)
- **App.jsx** has no auth-related routing

## 6. Required Frontend Changes

1. Create `src/services/api.js` — fetch wrapper with base URL `http://localhost:8080/api` and `Authorization: Bearer <token>` header
2. Create `src/context/AuthContext.jsx` — manage user state, tokens, login/logout
3. Create `src/pages/Login.jsx` and `src/pages/Register.jsx`
4. Store access token in memory (React state) and refresh token in httpOnly cookie or localStorage (trade-off: XSS vs CSRF)
5. Add token refresh logic (call `/auth/refresh` on 401)
6. Add protected route wrapper for Dashboard, Profile, Scholarships
7. Wire existing pages to backend APIs instead of localStorage/mock data

## 7. Data Contract Mismatches

- Frontend uses localStorage for profile; backend has no profile API yet (Phase 3 not implemented)
- Frontend scholarship data is mock (3 records); backend has no scholarship listing API yet (Phase 4 not implemented)
- Frontend match scores are criteria pass rates; backend has no eligibility engine yet (Phase 5 not implemented)
- Auth response includes `userId` (Long) and `role` (String "STUDENT"/"ADMIN"); frontend must handle these
- No pagination/filtering contract defined yet for scholarships

## 8. Integration Test Plan

1. Start backend (`mvn spring-boot:run` with `JWT_SECRET` env var)
2. Start frontend (`npm run dev`)
3. Test register → login → access protected endpoint → refresh → logout flow
4. Verify CORS allows frontend origin (localhost:5173)
5. Test token expiry and refresh rotation
6. Test rate limiting (429 response)

## 9. Recommendation

**Complete Phase 1 (remaining 6 entities) and Phases 3-5 (Profile, Scholarship, Eligibility APIs) before full frontend integration.** Authentication is ready for frontend integration independently. Frontend can begin auth UI work in parallel.

---
*Report generated for pre-integration readiness check.*