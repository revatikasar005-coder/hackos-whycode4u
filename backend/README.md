# HackOS Backend API

Node.js + Express + Supabase (PostgreSQL). Auth: JWT (bcrypt password hash).

**Base URL (local):** `http://localhost:5000`
**Deployed URL:** _(deploy ke baad yahan likhna)_

Protected APIs ke liye header lagao:
`Authorization: Bearer <token>`

## Test logins (password sabka: `password123`)

| Role | Email |
|---|---|
| Organizer | organizer@hackos.dev |
| Judge | judge1@hackos.dev |
| Volunteer | volunteer1@hackos.dev |
| Participant (team leader) | aarav@example.com |

## Setup

```
cd backend
npm install
# .env.example dekh ke .env banao
npm run dev
node scripts/seed.js   # demo data (sirf ek baar)
```

## APIs

| Method | Endpoint | Role | Kya karta hai |
|---|---|---|---|
| POST | /auth/register | Sab | name, email, phone, password. Duplicate email/phone par 409 |
| POST | /auth/login | Sab | email, password. `token` aur `role` wapas |
| GET | /me | Login user | Profile aur `qr_user_id` |
| POST | /teams | Participant | name, track, problem. Team banata hai |
| POST | /teams/:id/members | Leader | `{ "email", "action": "add" ya "remove" }` |
| GET | /teams | Organizer, Judge | Saari teams aur members |
| POST | /checkin | Volunteer, Organizer | `{ user_id, scanned_at, device_id }`. Double check-in par 409 |
| POST | /checkin/bulk | Volunteer, Organizer | `{ "checkins": [ {user_id, scanned_at, device_id} ] }`. Response: received, inserted, skipped |
| POST | /submissions | Participant | github_url, video_url, ppt_url. Server time, deadline ke baad 403 |
| GET | /judge/teams | Judge | Sirf assigned teams aur unki submissions |
| POST | /scores | Judge | `{ team_id, criteria: {innovation, design, impact} }`. Audit log banta hai |
| GET | /leaderboard | Login user | Teams average score ke order mein |
| GET | /audit-logs | Organizer | Saari changes (kisne, kab, old/new value) |
| POST | /announcements | Organizer | `{ title, message }` |
| GET | /announcements | Login user | Saare announcements |
| GET | /duplicates | Organizer | Shak wale duplicate users |
| GET | /health | Sab | Server aur DB check |

## Error codes

| Code | Matlab |
|---|---|
| 400 | Zaroori field missing |
| 401 | Token missing ya invalid |
| 403 | Role ko allow nahi, ya deadline ke baad submission |
| 409 | Duplicate (email, phone, check-in, team) |

## Database tables

users, events, teams, team_members (history: joined_at, left_at), checkins, submissions, scores, audit_logs (insert-only, trigger se edit/delete block), announcements, judge_assignments.