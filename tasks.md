# TECHNETICS Frontend Implementation Checklist

## **Phase 1: Entry Page & Authentication**
- [ ] Implement `GamesPage.tsx` Login Flow
  - [ ] Add Form for Participant login
  - [ ] Integrate Authentication API for Participant (`/api/auth/login`)
  - [ ] Add Validation and Error Handling
  - [ ] Add Admin login flow mapping to `/api/admin/login`

## **Phase 2: Waiting Room**
- [ ] Create `WaitingListPage.tsx`
  - [ ] Fetch current Round, Event, Waiting Room Count APIs (`GET /api/admin/events/:slug/waiting-room`)
  - [ ] Participant View: "Waiting for admin to start next round"
  - [ ] Admin View: Start Round button mapping to `POST /api/admin/events/:slug/start`
  - [ ] Ensure automatic redirect upon Start Game event

## **Phase 3: The Order of Obscure Code**
- [ ] Integrate server timer hook (`GET /api/timer/round/:roundId`)
- [ ] Build Aptitude MCQ Test UI
  - [ ] Pagination between Questions
  - [ ] Real-time autosave (`PUT /api/answers/round/:roundId/question/:questionId` & bulk)
  - [ ] Final Submit action (`POST /api/answers/round/:roundId/submit`)

## **Phase 4: Dark Mark Bounty Timer**
- [ ] Update `components/darkMarkBounty` with server timer hook
- [ ] Refactor client-side timer to sync with server `/api/timer/round/:roundId` API

## **Phase 5: Admin Panel**
- [ ] Create `/admin` layout (`AdminDashboard.tsx`) with 3 Tabs
- [ ] **Tab 1: The Order of Obscure Code**
  - [ ] Question CRUD & Bulk Upload
  - [ ] Timer Controls (Start, Pause, Resume, Stop, Expire)
  - [ ] Qualify Top N Teams Button
- [ ] **Tab 2: Dark Mark Bounty**
  - [ ] Admin Monitoring (teams, attempts, scores, timer)
- [ ] **Tab 3: Real-Time Leaderboard**
  - [ ] Aptitude Leaderboard display
  - [ ] Dark Mark Leaderboard display
  - [ ] Sync with Supabase Realtime / SSE endpoints
