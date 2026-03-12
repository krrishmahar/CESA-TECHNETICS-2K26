=== HEALTH CHECK ===
{
  "status": "ok",
  "uptime": 16.3874101,
  "timestamp": "2026-03-12T00:24:32.219Z",
  "environment": "development",
  "services": {
    "supabase": "connected",
    "database": "connected"
  }
}
=== ABOUT ===
{
  "project": {
    "name": "TECHNETICS_BACKEND",
    "version": "1.0.0",
    "description": "Node.js Express backend powered by Supabase and Prisma",
    "repository": "https://github.com/krrishmahar/TECHNETICS_BACKEND",
    "stack": [
      "Node.js",
      "Express",
      "Supabase",
      "Prisma",
      "PostgreSQL"
    ]
  },
  "developer": {
    "name": "Krrish Mahar",
    "github": "https://github.com/krrishmahar"
  }
}
=== SEED DATABASE ===
{
  "message": "Database seeded successfully",
  "admin": "krrish",
  "events": [
    "the-order-of-obscure-code",
    "dark-mark-bounty"
  ],
  "rounds": {
    "obscure": 3,
    "darkMark": 1
  },
  "participants_created": 12,
  "teams_created": 3,
  "questions_created": 5
}
=== PARTICIPANT LOGIN ===
{
  "participantId": "1",
  "fullName": "Team Member 1",
  "email": "member1@technetics.com",
  "registrationId": "1",
  "currentRound": 1,
  "isQualified": false,
  "status": "active",
  "event": {
    "id": "1",
    "slug": "the-order-of-obscure-code",
    "name": "The Order of Obscure Code"
  },
  "team": {
    "id": "1",
    "teamName": "Gryffindor Coders"
  }
}
=== PARTICIPANT CHECK-IN ===
{
  "registrationId": "1",
  "checkInTime": "2026-03-12T00:24:35.147Z"
}
=== ADMIN LOGIN ===
{
  "admin": {
    "id": "1",
    "username": "krrish",
    "email": "krrish@technetics.com",
    "role": "superadmin",
    "assignedEventId": null
  }
}
=== LIST ALL PARTICIPANTS ===
[
  {
    "id": "1",
    "fullName": "Team Member 1",
    "email": "member1@technetics.com",
    "phone": "9000000001",
    "registrationNo": "TM001",
    "createdAt": "2026-03-12T00:24:33.185Z"
  },
  {
    "id": "2",
    "fullName": "Team Member 2",
    "email": "member2@technetics.com",
    "phone": "9000000002",
    "registrationNo": "TM002",
    "createdAt": "2026-03-12T00:24:33.212Z"
  },
  {
    "id": "3",
    "fullName": "Team Member 3",
    "email": "member3@technetics.com",
    "phone": "9000000003",
    "registrationNo": "TM003",
    "createdAt": "2026-03-12T00:24:33.297Z"
  },
  {
    "id": "4",
    "fullName": "Team Member 4",
    "email": "member4@technetics.com",
    "phone": "9000000004",
    "registrationNo": "TM004",
    "createdAt": "2026-03-12T00:24:33.354Z"
  },
  {
    "id": "5",
    "fullName": "Team Member 5",
    "email": "member5@technetics.com",
    "phone": "9000000005",
    "registrationNo": "TM005",
    "createdAt": "2026-03-12T00:24:33.402Z"
  },
  {
    "id": "6",
    "fullName": "Team Member 6",
    "email": "member6@technetics.com",
    "phone": "9000000006",
    "registrationNo": "TM006",
    "createdAt": "2026-03-12T00:24:33.442Z"
  },
  {
    "id": "7",
    "fullName": "Team Member 7",
    "email": "member7@technetics.com",
    "phone": "9000000007",
    "registrationNo": "TM007",
    "createdAt": "2026-03-12T00:24:33.712Z"
  },
  {
    "id": "8",
    "fullName": "Team Member 8",
    "email": "member8@technetics.com",
    "phone": "9000000008",
    "registrationNo": "TM008",
    "createdAt": "2026-03-12T00:24:33.736Z"
  },
  {
    "id": "9",
    "fullName": "Team Member 9",
    "email": "member9@technetics.com",
    "phone": "9000000009",
    "registrationNo": "TM009",
    "createdAt": "2026-03-12T00:24:33.764Z"
  },
  {
    "id": "10",
    "fullName": "Team Member 10",
    "email": "member10@technetics.com",
    "phone": "9000000010",
    "registrationNo": "TM010",
    "createdAt": "2026-03-12T00:24:34.019Z"
  },
  {
    "id": "11",
    "fullName": "Team Member 11",
    "email": "member11@technetics.com",
    "phone": "9000000011",
    "registrationNo": "TM011",
    "createdAt": "2026-03-12T00:24:34.071Z"
  },
  {
    "id": "12",
    "fullName": "Team Member 12",
    "email": "member12@technetics.com",
    "phone": "9000000012",
    "registrationNo": "TM012",
    "createdAt": "2026-03-12T00:24:34.094Z"
  }
]
=== LIST PARTICIPANTS FOR EVENT ===
[
  {
    "registrationId": "1",
    "status": "active",
    "currentRound": 1,
    "isQualified": false,
    "checkInTime": "2026-03-12T00:24:35.147Z",
    "participant": null,
    "team": {
      "id": "1",
      "teamName": "Gryffindor Coders",
      "members": [
        {
          "id": "2",
          "fullName": "Team Member 2"
        },
        {
          "id": "3",
          "fullName": "Team Member 3"
        },
        {
          "id": "4",
          "fullName": "Team Member 4"
        }
      ]
    }
  },
  {
    "registrationId": "2",
    "status": "active",
    "currentRound": 1,
    "isQualified": false,
    "checkInTime": null,
    "participant": null,
    "team": {
      "id": "2",
      "teamName": "Slytherin Hackers",
      "members": [
        {
          "id": "6",
          "fullName": "Team Member 6"
        },
        {
          "id": "7",
          "fullName": "Team Member 7"
        },
        {
          "id": "8",
          "fullName": "Team Member 8"
        }
      ]
    }
  }
]
=== ADD PARTICIPANT ===
{
  "id": "13",
  "fullName": "Jane Doe",
  "email": "jane@technetics.com",
  "phone": null,
  "registrationNo": "TM099",
  "createdAt": "2026-03-12T00:24:35.492Z"
}
=== BULK ADD PARTICIPANTS ===
{
  "created": 2,
  "failed": []
}
=== UPDATE PARTICIPANT ===
{
  "id": "1",
  "fullName": "Team Member 1",
  "email": "member1@technetics.com",
  "phone": "9999999999",
  "registrationNo": "TM001",
  "createdAt": "2026-03-12T00:24:33.185Z"
}
=== LIST TEAMS — ORDER EVENT ===
[
  {
    "id": "1",
    "teamName": "Gryffindor Coders",
    "teamCode": "GRYF",
    "leader": {
      "id": "1",
      "fullName": "Team Member 1",
      "email": "member1@technetics.com"
    },
    "members": [
      {
        "id": "2",
        "fullName": "Team Member 2",
        "email": "member2@technetics.com"
      },
      {
        "id": "3",
        "fullName": "Team Member 3",
        "email": "member3@technetics.com"
      },
      {
        "id": "4",
        "fullName": "Team Member 4",
        "email": "member4@technetics.com"
      }
    ],
    "registration": {
      "id": "1",
      "status": "active",
      "currentRound": 1,
      "isQualified": false,
      "checkInTime": "2026-03-12T00:24:35.147Z"
    }
  },
  {
    "id": "2",
    "teamName": "Slytherin Hackers",
    "teamCode": "SLYT",
    "leader": {
      "id": "5",
      "fullName": "Team Member 5",
      "email": "member5@technetics.com"
    },
    "members": [
      {
        "id": "6",
        "fullName": "Team Member 6",
        "email": "member6@technetics.com"
      },
      {
        "id": "7",
        "fullName": "Team Member 7",
        "email": "member7@technetics.com"
      },
      {
        "id": "8",
        "fullName": "Team Member 8",
        "email": "member8@technetics.com"
      }
    ],
    "registration": {
      "id": "2",
      "status": "active",
      "currentRound": 1,
      "isQualified": false,
      "checkInTime": null
    }
  }
]
=== LIST TEAMS — DARK MARK EVENT ===
[
  {
    "id": "3",
    "teamName": "Ravenclaw Devs",
    "teamCode": "RAVN",
    "leader": {
      "id": "9",
      "fullName": "Team Member 9",
      "email": "member9@technetics.com"
    },
    "members": [
      {
        "id": "10",
        "fullName": "Team Member 10",
        "email": "member10@technetics.com"
      },
      {
        "id": "11",
        "fullName": "Team Member 11",
        "email": "member11@technetics.com"
      },
      {
        "id": "12",
        "fullName": "Team Member 12",
        "email": "member12@technetics.com"
      }
    ],
    "registration": {
      "id": "3",
      "status": "active",
      "currentRound": 1,
      "isQualified": false,
      "checkInTime": null
    }
  }
]
=== GET WAITING ROOM COUNT (order) ===
{
  "total": 2,
  "checkedIn": 1,
  "waiting": 1
}
=== GET WAITING ROOM COUNT (dark mark) ===
{
  "total": 1,
  "checkedIn": 0,
  "waiting": 1
}
=== START GAME — ORDER OF OBSCURE CODE ===
{
  "broadcasted": true,
  "redirectTo": "/event/the-order-of-obscure-code"
}
=== START GAME — DARK MARK BOUNTY ===
{
  "broadcasted": true,
  "redirectTo": "/event/dark-mark-bounty"
}
=== QUALIFY TOP N ===
{
  "error": "adminId required — pass in body as adminId or set auth middleware"
}
=== GET ALL QUESTIONS (admin, with answers) ===
[
  {
    "id": "1",
    "roundId": "1",
    "questionText": "What does HTML stand for?",
    "optionA": "Hyper Text Markup Language",
    "optionB": "High Text Machine Language",
    "optionC": "Hyper Tool Multi Language",
    "optionD": "Hyperlink Text Markup Logic",
    "correctOption": "A",
    "explanation": null,
    "points": 50,
    "negativeMarks": 0,
    "orderIndex": 1,
    "createdAt": "2026-03-12T00:24:34.630Z"
  },
  {
    "id": "2",
    "roundId": "1",
    "questionText": "Which language is used for styling web pages?",
    "optionA": "HTML",
    "optionB": "JQuery",
    "optionC": "CSS",
    "optionD": "XML",
    "correctOption": "C",
    "explanation": null,
    "points": 50,
    "negativeMarks": 0,
    "orderIndex": 2,
    "createdAt": "2026-03-12T00:24:34.685Z"
  },
  {
    "id": "3",
    "roundId": "1",
    "questionText": "What is the capital of France?",
    "optionA": "Berlin",
    "optionB": "Madrid",
    "optionC": "Paris",
    "optionD": "Rome",
    "correctOption": "C",
    "explanation": null,
    "points": 50,
    "negativeMarks": 0,
    "orderIndex": 3,
    "createdAt": "2026-03-12T00:24:34.710Z"
  },
  {
    "id": "4",
    "roundId": "1",
    "questionText": "Which of these is a valid JavaScript framework?",
    "optionA": "Django",
    "optionB": "React",
    "optionC": "Laravel",
    "optionD": "Flask",
    "correctOption": "B",
    "explanation": null,
    "points": 50,
    "negativeMarks": 0,
    "orderIndex": 4,
    "createdAt": "2026-03-12T00:24:34.755Z"
  },
  {
    "id": "5",
    "roundId": "1",
    "questionText": "What does SQL stand for?",
    "optionA": "Structured Query Language",
    "optionB": "Styling Question Logic",
    "optionC": "Strong Query Language",
    "optionD": "Statement Question Language",
    "correctOption": "A",
    "explanation": null,
    "points": 50,
    "negativeMarks": 0,
    "orderIndex": 5,
    "createdAt": "2026-03-12T00:24:34.797Z"
  }
]
=== GET PLAY QUESTIONS (shuffled, no answers) ===
[
  {
    "id": "2",
    "roundId": "1",
    "questionText": "Which language is used for styling web pages?",
    "optionA": "HTML",
    "optionB": "JQuery",
    "optionC": "CSS",
    "optionD": "XML",
    "points": "50",
    "negativeMarks": "0",
    "orderIndex": 2,
    "createdAt": "2026-03-12T00:24:34.685Z"
  },
  {
    "id": "4",
    "roundId": "1",
    "questionText": "Which of these is a valid JavaScript framework?",
    "optionA": "Django",
    "optionB": "React",
    "optionC": "Laravel",
    "optionD": "Flask",
    "points": "50",
    "negativeMarks": "0",
    "orderIndex": 4,
    "createdAt": "2026-03-12T00:24:34.755Z"
  },
  {
    "id": "5",
    "roundId": "1",
    "questionText": "What does SQL stand for?",
    "optionA": "Structured Query Language",
    "optionB": "Styling Question Logic",
    "optionC": "Strong Query Language",
    "optionD": "Statement Question Language",
    "points": "50",
    "negativeMarks": "0",
    "orderIndex": 5,
    "createdAt": "2026-03-12T00:24:34.797Z"
  },
  {
    "id": "3",
    "roundId": "1",
    "questionText": "What is the capital of France?",
    "optionA": "Berlin",
    "optionB": "Madrid",
    "optionC": "Paris",
    "optionD": "Rome",
    "points": "50",
    "negativeMarks": "0",
    "orderIndex": 3,
    "createdAt": "2026-03-12T00:24:34.710Z"
  },
  {
    "id": "1",
    "roundId": "1",
    "questionText": "What does HTML stand for?",
    "optionA": "Hyper Text Markup Language",
    "optionB": "High Text Machine Language",
    "optionC": "Hyper Tool Multi Language",
    "optionD": "Hyperlink Text Markup Logic",
    "points": "50",
    "negativeMarks": "0",
    "orderIndex": 1,
    "createdAt": "2026-03-12T00:24:34.630Z"
  }
]
=== GET QUESTION COUNT ===
{
  "count": 5
}
=== GET SINGLE QUESTION ===
{
  "id": "1",
  "roundId": "1",
  "questionText": "What does HTML stand for?",
  "optionA": "Hyper Text Markup Language",
  "optionB": "High Text Machine Language",
  "optionC": "Hyper Tool Multi Language",
  "optionD": "Hyperlink Text Markup Logic",
  "correctOption": "A",
  "explanation": null,
  "points": 50,
  "negativeMarks": 0,
  "orderIndex": 1,
  "createdAt": "2026-03-12T00:24:34.630Z"
}
=== CREATE QUESTION (orderIndex auto-assigned safely) ===
{
  "id": "6",
  "roundId": "1",
  "questionText": "What is 2 + 2?",
  "optionA": "3",
  "optionB": "4",
  "optionC": "5",
  "optionD": "6",
  "correctOption": "B",
  "explanation": "Basic arithmetic",
  "points": 10,
  "negativeMarks": 0,
  "orderIndex": 6,
  "createdAt": "2026-03-12T00:24:36.313Z"
}
=== BULK CREATE QUESTIONS (upsert — safe to re-run) ===
{
  "processed": 2
}
=== UPDATE QUESTION ===
{
  "id": "1",
  "roundId": "1",
  "questionText": "What does HTML stand for?",
  "optionA": "Hyper Text Markup Language",
  "optionB": "High Text Machine Language",
  "optionC": "Hyper Tool Multi Language",
  "optionD": "Hyperlink Text Markup Logic",
  "correctOption": "A",
  "explanation": null,
  "points": 50,
  "negativeMarks": 0,
  "orderIndex": 1,
  "createdAt": "2026-03-12T00:24:34.630Z"
}
=== GET SAVED ANSWERS (hard-refresh recovery) ===
[]
=== SAVE SINGLE ANSWER ===
{
  "error": "Round is not accepting answers — timer status is \"stopped\""
}
=== BULK SAVE ANSWERS ===
{
  "error": "Round is not accepting answers — timer status is \"stopped\""
}
=== SUBMIT ROUND ===
{
  "message": "Already submitted",
  "submittedAt": "2026-03-12T00:24:34.824Z"
}
=== AUTO-SUBMIT ALL (cron) ===
{
  "autoSubmitted": 0,
  "failed": 0,
  "total": 0
}
=== GET TIMER STATE (round 1) ===
{
  "roundId": "1",
  "timerStatus": "stopped",
  "remainingSeconds": 0,
  "durationSeconds": 3600,
  "startedAt": "2026-03-11T23:24:34.915Z",
  "pausedAt": null,
  "stoppedAt": "2026-03-12T00:24:34.915Z",
  "totalPausedSecs": 0,
  "adminNote": null
}
=== GET TIMER STATE (boss round) ===
{
  "roundId": "4",
  "timerStatus": "stopped",
  "remainingSeconds": 0,
  "durationSeconds": 7200,
  "startedAt": "2026-03-11T22:24:34.941Z",
  "pausedAt": null,
  "stoppedAt": "2026-03-12T00:24:34.941Z",
  "totalPausedSecs": 0,
  "adminNote": null
}
=== START TIMER (round 2 — not yet started) ===
{
  "id": "3",
  "roundId": "2",
  "timerStatus": "running",
  "startedAt": "2026-03-12T00:24:37.860Z",
  "pausedAt": null,
  "stoppedAt": null,
  "totalPausedSecs": 0,
  "remainingAtStop": null,
  "adminNote": "Round 2 started",
  "lastActionBy": "1",
  "updatedAt": "2026-03-12T00:24:37.862Z"
}
=== PAUSE TIMER (round 2) ===
{
  "id": "3",
  "roundId": "2",
  "timerStatus": "paused",
  "startedAt": "2026-03-12T00:24:37.860Z",
  "pausedAt": "2026-03-12T00:24:38.304Z",
  "stoppedAt": null,
  "totalPausedSecs": 0,
  "remainingAtStop": null,
  "adminNote": "Round 2 started",
  "lastActionBy": "1",
  "updatedAt": "2026-03-12T00:24:38.304Z"
}
=== RESUME TIMER (round 2) ===
{
  "id": "3",
  "roundId": "2",
  "timerStatus": "running",
  "startedAt": "2026-03-12T00:24:37.860Z",
  "pausedAt": null,
  "stoppedAt": null,
  "totalPausedSecs": 0,
  "remainingAtStop": null,
  "adminNote": "Round 2 started",
  "lastActionBy": "1",
  "updatedAt": "2026-03-12T00:24:38.526Z"
}
=== STOP TIMER (round 2) ===
{
  "id": "3",
  "roundId": "2",
  "timerStatus": "stopped",
  "startedAt": "2026-03-12T00:24:37.860Z",
  "pausedAt": null,
  "stoppedAt": "2026-03-12T00:24:38.745Z",
  "totalPausedSecs": 0,
  "remainingAtStop": 3599,
  "adminNote": "Stopped early",
  "lastActionBy": "1",
  "updatedAt": "2026-03-12T00:24:38.746Z"
}
=== EXPIRE TIMER + AUTO-SUBMIT ===
{
  "timer": null,
  "autoSubmit": {
    "autoSubmitted": 0,
    "failed": 0,
    "total": 0
  }
}
=== APTITUDE LEADERBOARD ===
[
  {
    "id": "1",
    "registrationId": "1",
    "roundId": "1",
    "teamId": "1",
    "teamName": "Gryffindor Coders",
    "totalScore": "250",
    "correctAnswers": 5,
    "wrongAnswers": 0,
    "skippedAnswers": 0,
    "totalQuestions": 5,
    "completionTimeSec": 2700,
    "rank": 1,
    "submittedAt": "2026-03-12T00:24:34.824Z",
    "completionTimeMins": 45
  },
  {
    "id": "2",
    "registrationId": "2",
    "roundId": "1",
    "teamId": "2",
    "teamName": "Slytherin Hackers",
    "totalScore": "150",
    "correctAnswers": 3,
    "wrongAnswers": 2,
    "skippedAnswers": 0,
    "totalQuestions": 5,
    "completionTimeSec": 3600,
    "rank": 2,
    "submittedAt": "2026-03-12T00:24:34.851Z",
    "completionTimeMins": 60
  }
]
=== DARKMARK LEADERBOARD ===
[
  {
    "id": "1",
    "registrationId": "3",
    "roundId": "4",
    "teamId": "3",
    "teamName": "Ravenclaw Devs",
    "players": [
      "Team Member 9",
      "Team Member 10",
      "Team Member 11",
      "Team Member 12"
    ],
    "totalScore": "500",
    "bountiesSolved": 1,
    "solvedBounties": [
      {
        "code": "BOSS1",
        "game": "Final Boss",
        "points": 500
      }
    ],
    "usedCodes": [
      "BOSS1"
    ],
    "correctAttempt": 1,
    "wrongAttempt": 0,
    "totalAttempt": 1,
    "completionTimeSec": 3000,
    "rank": 1,
    "submittedAt": "2026-03-12T00:24:34.891Z",
    "updatedAt": "2026-03-12T00:24:34.891Z",
    "completionTimeMins": 50
  }
]
