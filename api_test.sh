#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════
# TECHNETICS Event Platform — cURL Test Commands  (fixed)
# ═══════════════════════════════════════════════════════════════════════════════

BASE="http://localhost:3000"
SLUG_ORDER="the-order-of-obscure-code"
SLUG_DARK="dark-mark-bounty"

# IDs from seeded data — update if your DB auto-assigned different values
ROUND_ID="2"           # Round 2 (coding) — RUNNING: use for answer/submit/timer tests
BOSS_ROUND_ID="4"      # Round 1 of Dark Mark Bounty
QUESTION_ID="1"
PARTICIPANT_ID="1"
TEAM_ID="1"
EVENT_ID_ORDER="1"
EVENT_ID_DARK="2"
REGISTRATION_ID="1"    # Gryffindor Coders registration
ADMIN_ID="1"           # seeded admin

# ───────────────────────────────────────────────────────────────────────────────
# SYSTEM
# ───────────────────────────────────────────────────────────────────────────────
echo "=== HEALTH CHECK ==="
curl -s "$BASE/healthcheck" | jq .

echo "=== ABOUT ==="
curl -s "$BASE/about" | jq .

echo "=== SEED DATABASE ==="
curl -s -X POST "$BASE/api/seed" | jq .


# ───────────────────────────────────────────────────────────────────────────────
# AUTH
# ───────────────────────────────────────────────────────────────────────────────
echo "=== PARTICIPANT LOGIN ==="
curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"member1@technetics.com","password":"TECHNETICS"}' | jq .

echo "=== PARTICIPANT CHECK-IN ==="
curl -s -X POST "$BASE/api/auth/checkin" \
  -H "Content-Type: application/json" \
  -d "{\"registrationId\":\"$REGISTRATION_ID\"}" | jq .


# ───────────────────────────────────────────────────────────────────────────────
# ADMIN
# ───────────────────────────────────────────────────────────────────────────────
echo "=== ADMIN LOGIN ==="
curl -s -X POST "$BASE/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"krrish@technetics.com","password":"password"}' | jq .

echo "=== LIST ALL PARTICIPANTS ==="
curl -s "$BASE/api/admin/participants" | jq .

echo "=== LIST PARTICIPANTS FOR EVENT ==="
curl -s "$BASE/api/admin/participants?event=$SLUG_ORDER" | jq .

echo "=== ADD PARTICIPANT ==="
curl -s -X POST "$BASE/api/admin/participants" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jane Doe","email":"jane@technetics.com","registrationNo":"TM099"}' | jq .

echo "=== BULK ADD PARTICIPANTS ==="
curl -s -X POST "$BASE/api/admin/participants/bulk" \
  -H "Content-Type: application/json" \
  -d '{"participants":[
    {"fullName":"Alice","email":"alice@technetics.com","registrationNo":"TM100"},
    {"fullName":"Bob","email":"bob@technetics.com","registrationNo":"TM101"}
  ]}' | jq .

echo "=== UPDATE PARTICIPANT ==="
curl -s -X PUT "$BASE/api/admin/participants/$PARTICIPANT_ID" \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999"}' | jq .

echo "=== LIST TEAMS — ORDER EVENT ==="
curl -s "$BASE/api/admin/events/$SLUG_ORDER/teams" | jq .

echo "=== LIST TEAMS — DARK MARK EVENT ==="
curl -s "$BASE/api/admin/events/$SLUG_DARK/teams" | jq .

echo "=== GET WAITING ROOM COUNT (order) ==="
curl -s "$BASE/api/admin/events/$SLUG_ORDER/waiting-room" | jq .

echo "=== GET WAITING ROOM COUNT (dark mark) ==="
curl -s "$BASE/api/admin/events/$SLUG_DARK/waiting-room" | jq .

echo "=== START GAME — ORDER OF OBSCURE CODE ==="
curl -s -X POST "$BASE/api/admin/events/$SLUG_ORDER/start" \
  -H "Content-Type: application/json" \
  -d '{"redirectTo":"/event/the-order-of-obscure-code"}' | jq .

echo "=== START GAME — DARK MARK BOUNTY ==="
curl -s -X POST "$BASE/api/admin/events/$SLUG_DARK/start" \
  -H "Content-Type: application/json" \
  -d '{"redirectTo":"/event/dark-mark-bounty"}' | jq .

echo "=== QUALIFY TOP N ==="
curl -s -X POST "$BASE/api/admin/rounds/$ROUND_ID/qualify" \
  -H "Content-Type: application/json" \
  -d '{"topN":2}' | jq .


# ───────────────────────────────────────────────────────────────────────────────
# QUESTIONS
# ───────────────────────────────────────────────────────────────────────────────
echo "=== GET ALL QUESTIONS (admin, with answers) ==="
curl -s "$BASE/api/questions/round/$ROUND_ID" | jq .

echo "=== GET PLAY QUESTIONS (shuffled, no answers) ==="
# FIX: pass registrationId as query param — no auth middleware yet
curl -s "$BASE/api/questions/round/$ROUND_ID/play?registrationId=$REGISTRATION_ID" | jq .

echo "=== GET QUESTION COUNT ==="
curl -s "$BASE/api/questions/round/$ROUND_ID/count" | jq .

echo "=== GET SINGLE QUESTION ==="
curl -s "$BASE/api/questions/$QUESTION_ID" | jq .

echo "=== CREATE QUESTION (orderIndex auto-assigned safely) ==="
# FIX: no longer need to specify orderIndex — auto-finds next safe index
curl -s -X POST "$BASE/api/questions" \
  -H "Content-Type: application/json" \
  -d "{
    \"roundId\":\"$ROUND_ID\",
    \"questionText\":\"What is 2 + 2?\",
    \"optionA\":\"3\",\"optionB\":\"4\",\"optionC\":\"5\",\"optionD\":\"6\",
    \"correctOption\":\"B\",
    \"explanation\":\"Basic arithmetic\",
    \"points\":10,\"negativeMarks\":0
  }" | jq .

echo "=== BULK CREATE QUESTIONS (upsert — safe to re-run) ==="
# FIX: now uses upsert so re-running returns processed count, not 0
curl -s -X POST "$BASE/api/questions/bulk" \
  -H "Content-Type: application/json" \
  -d "{
    \"roundId\":\"$ROUND_ID\",
    \"questions\":[
      {\"questionText\":\"What is TypeScript?\",
       \"optionA\":\"A database\",\"optionB\":\"A superset of JavaScript\",
       \"optionC\":\"A CSS framework\",\"optionD\":\"A testing library\",
       \"correctOption\":\"B\",\"points\":10,\"orderIndex\":10},
      {\"questionText\":\"What does REST stand for?\",
       \"optionA\":\"Remote Execution\",\"optionB\":\"Rapid Endpoint\",
       \"optionC\":\"Representational State Transfer\",\"optionD\":\"Resource Entity\",
       \"correctOption\":\"C\",\"points\":10,\"orderIndex\":11}
    ]
  }" | jq .

echo "=== UPDATE QUESTION ==="
curl -s -X PUT "$BASE/api/questions/$QUESTION_ID" \
  -H "Content-Type: application/json" \
  -d '{"points":50}' | jq .


# ───────────────────────────────────────────────────────────────────────────────
# ANSWERS
# FIX: all answer endpoints now accept registrationId in body as fallback
# ───────────────────────────────────────────────────────────────────────────────
echo "=== GET SAVED ANSWERS (hard-refresh recovery) ==="
curl -s "$BASE/api/answers/round/$ROUND_ID?registrationId=$REGISTRATION_ID" | jq .

echo "=== SAVE SINGLE ANSWER ==="
curl -s -X PUT "$BASE/api/answers/round/$ROUND_ID/question/$QUESTION_ID" \
  -H "Content-Type: application/json" \
  -d "{\"selectedOption\":\"A\",\"registrationId\":\"$REGISTRATION_ID\"}" | jq .

echo "=== BULK SAVE ANSWERS ==="
curl -s -X PUT "$BASE/api/answers/round/$ROUND_ID/bulk" \
  -H "Content-Type: application/json" \
  -d "{
    \"registrationId\":\"$REGISTRATION_ID\",
    \"answers\":[
      {\"questionId\":\"1\",\"selectedOption\":\"A\"},
      {\"questionId\":\"2\",\"selectedOption\":\"C\"},
      {\"questionId\":\"3\",\"selectedOption\":\"C\"},
      {\"questionId\":\"4\",\"selectedOption\":\"B\"},
      {\"questionId\":\"5\",\"selectedOption\":\"A\"}
    ]
  }" | jq .

echo "=== SUBMIT ROUND ==="
curl -s -X POST "$BASE/api/answers/round/$ROUND_ID/submit" \
  -H "Content-Type: application/json" \
  -d "{\"registrationId\":\"$REGISTRATION_ID\"}" | jq .

echo "=== AUTO-SUBMIT ALL (cron) ==="
curl -s -X POST "$BASE/api/answers/round/$ROUND_ID/auto-submit" | jq .


# ───────────────────────────────────────────────────────────────────────────────
# TIMER
# FIX: adminId now accepted in request body as fallback (no middleware needed for testing)
# NOTE: seed sets timers to "stopped" — reset them first or use a fresh round
# ───────────────────────────────────────────────────────────────────────────────
echo "=== GET TIMER STATE (round 1) ==="
curl -s "$BASE/api/timer/round/$ROUND_ID" | jq .

echo "=== GET TIMER STATE (boss round) ==="
curl -s "$BASE/api/timer/round/$BOSS_ROUND_ID" | jq .

echo "=== START TIMER (round 2 — not yet started) ==="
# Round 3 is pending (clean slate) — use it for timer start/pause/stop tests
curl -s -X POST "$BASE/api/timer/round/3/start" \
  -H "Content-Type: application/json" \
  -d "{\"adminId\":\"$ADMIN_ID\",\"note\":\"Round 2 started\"}" | jq .

echo "=== PAUSE TIMER (round 2) ==="
curl -s -X POST "$BASE/api/timer/round/3/pause" \
  -H "Content-Type: application/json" \
  -d "{\"adminId\":\"$ADMIN_ID\"}" | jq .

echo "=== RESUME TIMER (round 2) ==="
curl -s -X POST "$BASE/api/timer/round/3/resume" \
  -H "Content-Type: application/json" \
  -d "{\"adminId\":\"$ADMIN_ID\"}" | jq .

echo "=== STOP TIMER (round 2) ==="
curl -s -X POST "$BASE/api/timer/round/3/stop" \
  -H "Content-Type: application/json" \
  -d "{\"adminId\":\"$ADMIN_ID\",\"note\":\"Stopped early\"}" | jq .

echo "=== EXPIRE TIMER + AUTO-SUBMIT ==="
curl -s -X POST "$BASE/api/timer/round/$ROUND_ID/expire" | jq .


# ───────────────────────────────────────────────────────────────────────────────
# LEADERBOARD
# ───────────────────────────────────────────────────────────────────────────────
echo "=== APTITUDE LEADERBOARD ==="
curl -s "$BASE/api/events/$SLUG_ORDER/leaderboard/aptitude" | jq .

echo "=== DARKMARK LEADERBOARD ==="
curl -s "$BASE/api/events/$SLUG_DARK/leaderboard/darkmark" | jq .

# SSE — uncomment to test (keep-alive, Ctrl+C to stop)
# curl -N -H "Accept: text/event-stream" "$BASE/api/events/$SLUG_ORDER/leaderboard/aptitude/realtime"
# curl -N -H "Accept: text/event-stream" "$BASE/api/events/$SLUG_DARK/leaderboard/darkmark/realtime"
# curl -N "$BASE/api/admin/events/$SLUG_ORDER/waiting-room/stream"
# curl -N "$BASE/api/admin/game-events/$EVENT_ID_ORDER/stream"


# ───────────────────────────────────────────────────────────────────────────────
# SMOKE TEST — all safe GET endpoints, prints ✅ / ❌ + status code
# ───────────────────────────────────────────────────────────────────────────────
smoke_test() {
  echo ""
  echo "════════════════════════════════════════════════"
  echo "  SMOKE TEST — GET endpoints"
  echo "════════════════════════════════════════════════"
  declare -a endpoints=(
    "/healthcheck"
    "/about"
    "/api/admin/participants"
    "/api/admin/participants?event=$SLUG_ORDER"
    "/api/admin/events/$SLUG_ORDER/teams"
    "/api/admin/events/$SLUG_DARK/teams"
    "/api/admin/events/$SLUG_ORDER/waiting-room"
    "/api/admin/events/$SLUG_DARK/waiting-room"
    "/api/questions/round/$ROUND_ID"
    "/api/questions/round/$ROUND_ID/count"
    "/api/questions/round/$ROUND_ID/play?registrationId=$REGISTRATION_ID"
    "/api/questions/$QUESTION_ID"
    "/api/answers/round/$ROUND_ID?registrationId=$REGISTRATION_ID"
    "/api/timer/round/$ROUND_ID"
    "/api/timer/round/$BOSS_ROUND_ID"
    "/api/events/$SLUG_ORDER/leaderboard/aptitude"
    "/api/events/$SLUG_DARK/leaderboard/darkmark"
  )
  for ep in "${endpoints[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$ep")
    if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
      echo "  ✅  $status  $ep"
    else
      echo "  ❌  $status  $ep"
    fi
  done
  echo ""
}

# Uncomment to run smoke test:
smoke_test