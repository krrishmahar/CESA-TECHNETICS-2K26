You are working on a **React + Vite frontend for the TECHNETICS event platform**.

Your task is to **analyze the existing `src/` folder, detect missing pages/components, and implement them correctly while integrating with the backend APIs and server timer system.**

Do NOT rewrite existing working UI components. Extend the system carefully.

---

# 1. Project Context

Frontend stack:

* React
* Vite
* TypeScript
* Supabase client
* Existing UI in `components/`
* Games already implemented for Dark Mark Bounty

Backend:

* Node + Express API
* PostgreSQL
* Prisma ORM
* Supabase used for realtime leaderboard streaming

Backend already provides APIs for:

* authentication
* participants
* admin
* questions
* answers
* timer
* leaderboard
* waiting room
* event start
* round control

Use existing APIs rather than inventing new ones unless absolutely necessary.

---

# 2. Analyze Existing Source Code

First scan the **entire `/src` folder** and understand the structure.

Important directories:

src/
components/
components/darkMarkBounty/
components/darkMarkBounty/games
components/darkMarkBounty/screens
data/darkMarkBounty/puzzles
pages/
hooks/
layouts/

Games and puzzle data already exist for Dark Mark Bounty.

Do NOT modify puzzle data.

---

# 3. Main Entry Page

Entry point for participants:

/games → `GamesPage.tsx`

Features:

Participant login
Admin access

Participant login flow:

1. User enters email and password
2. Check Supabase database:

   * verify email exists in `participants`
3. If valid → call backend auth API
4. Redirect to waiting page

Admin login:

If email/password matches a record in `AdminUser` table:
redirect to `/admin`

Use backend authentication API.

---

# 4. Waiting Page

Create or fix:

WaitingListPage.tsx

Purpose:

Participants must see a waiting page **before each round starts**.

Features:

* show event name
* show current round
* show status: "Waiting for admin to start next round"

Admin must be able to see:

* how many teams are waiting
* which round they are in
* which event they belong to

Admin presses **Start Round button** → participants automatically move to next page.

Use API:

GET /api/admin/events/:slug/waiting-room
POST /api/admin/events/:slug/start

---

# 5. Event Structure

Event 1
"The Order of Obscure Code"

Round type:
aptitude

Timer:
60 minutes

Features:

* MCQ questions
* pagination
* autosave answers
* submit answers

Use APIs:

GET /api/questions/round/:roundId/play
GET /api/questions/round/:roundId/count
GET /api/answers/round/:roundId
PUT /api/answers/round/:roundId/question/:questionId
PUT /api/answers/round/:roundId/bulk
POST /api/answers/round/:roundId/submit

Timer:

Use server timer API only.

GET /api/timer/round/:roundId

Do NOT implement client timers.

---

# 6. Event 2

Dark Mark Bounty

Timer:
90 minutes

Game UI already exists in:

components/darkMarkBounty

Use:

DarkMarkBountyPage.tsx

Puzzle data:

data/darkMarkBounty/puzzles

Game flow already implemented:

LandingScreen
TeamDashboard
GameScreen
LeaderboardScreen

Integrate the **server timer API** with the existing timer hooks.

---

# 7. Admin Panel

Create a full admin dashboard page:

/admin

Admin panel must contain **tabs**.

Tabs:

1. The Order of Obscure Code
2. Dark Mark Bounty
3. Leaderboard

---

## Tab 1: The Order of Obscure Code

Admin controls:

Create aptitude questions

Bulk upload questions

Edit questions

Start round

Pause timer

Resume timer

Stop timer

Expire timer

Qualify top N teams

Use APIs:

GET /api/questions/round/:roundId
POST /api/questions
POST /api/questions/bulk
PUT /api/questions/:id

Timer APIs:

POST /api/timer/round/:id/start
POST /api/timer/round/:id/pause
POST /api/timer/round/:id/resume
POST /api/timer/round/:id/stop
POST /api/timer/round/:id/expire

---

## Tab 2: Dark Mark Bounty

Admin features:

Start round

Monitor teams

View attempts

View scores

Timer controls

Use round timer API.

---

## Tab 3: Leaderboard

Create realtime leaderboard display.

Show:

* aptitude leaderboard
* dark mark leaderboard

Use APIs:

GET /api/events/:slug/leaderboard/aptitude
GET /api/events/:slug/leaderboard/darkmark

Realtime updates using:

Supabase realtime or SSE endpoint.

---

# 8. Server Timer Integration

All rounds use **server controlled timer**.

Do NOT use local timers.

Display remaining time by polling or subscribing to:

GET /api/timer/round/:roundId

Timer states:

pending
running
paused
stopped
expired

Handle these states correctly in UI.

---

# 9. Database Structure (Important)

Backend uses Prisma models.

Important tables:

Event
Round
RoundTimer
Participant
Team
EventRegistration
AdminUser
Question
AptitudeAnswer
AptitudeLeaderboard
DarkMarkLeaderboard

Use these models to understand relationships.

---

# 10. Navigation Flow

Participant flow:

/games
→ waiting page
→ aptitude round
→ waiting page
→ dark mark bounty
→ leaderboard

Admin flow:

/games
→ admin login
→ /admin dashboard

---

# 11. Implementation Rules

Important:

1. Do NOT break existing DarkMarkBounty UI.
2. Do NOT rewrite puzzle data.
3. Detect missing pages automatically.
4. Use existing hooks where possible.
5. Use server timer API instead of local timers.
6. Implement robust API error handling.
7. Ensure pages are mobile responsive.
8. Avoid unnecessary state duplication.

---

# 12. Expected Output

After analyzing `/src` you should:

1. Create missing pages.
2. Fix waiting room flow.
3. Implement admin dashboard.
4. Integrate backend APIs.
5. Integrate server timers.
6. Implement leaderboard page.
7. Connect login with Supabase + backend.

Return:

* new pages
* modified pages
* explanation of changes
* API integration points

Do not generate unnecessary code.
