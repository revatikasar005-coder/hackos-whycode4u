# HackOS

HackOS is an all-in-one hackathon management platform. It handles registration, teams, project submissions, QR check-in, judging, live leaderboards, audit logs and announcements, with an offline-first mode for venues with poor internet.

Live frontend: https://hackos-whycode4u.vercel.app

## New in the PayPal AI Hackathon

During the hackathon period we added **Sponsor the Prize Pool**, a new flow that lets sponsors fund a hackathon with PayPal, guided by AI.

- **PayPal Orders API (Sandbox):** the backend creates and captures orders (`backend/routes/paypal.js`), and the React page renders the PayPal Smart Buttons (`frontend/src/pages/Sponsor.jsx`).
- **AI amount suggestion:** a sponsor describes their company or budget, and Google Gemini (`gemini-2.5-flash`) recommends a sponsorship amount, which pre-fills the PayPal checkout (`backend/routes/ai.js`).
- **Navigation and UI:** a new Sponsor page and navbar link, with preset amounts, an AI suggestion card and a payment success screen.

Everything else (auth, teams, submissions, check-in, scoring, leaderboard, judge panel, audit logs, offline sync) existed before this hackathon. Replace this line with the honest date your project started.

## How PayPal and AI work together

1. The sponsor types something like "small startup with a $200 marketing budget".
2. `POST /ai/suggest` sends that to Gemini and returns a short explanation and a suggested amount.
3. The amount fills the checkout, and the sponsor pays with PayPal.
4. `POST /paypal/create-order` creates the order and `POST /paypal/capture-order/:id` captures it.

## AI tools used

- Google Gemini API (`gemini-2.5-flash`) for the in-app amount suggestion.
- Claude (Anthropic) was used as a coding assistant while building the integration.

## Tech stack

- Frontend: React + Vite, deployed on Vercel
- Backend: Node.js + Express
- Database: Supabase
- Payments: PayPal Orders API and JS SDK (Sandbox)
- AI: Google Gemini API

## Run locally

Requirements: Node.js 18 or newer.

```bash
# Backend
cd backend
npm install
# create backend/.env (see below)
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173/sponsor to try the sponsorship flow.

`backend/.env`:

```
PORT=5000
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
GEMINI_API_KEY=
```

Use PayPal **Sandbox** credentials and a Sandbox personal (buyer) account to test. No real money is used.

## Team

Team WhyCode4U

## License

MIT, see [LICENSE](LICENSE).
