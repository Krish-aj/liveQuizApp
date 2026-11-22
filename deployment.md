# Deployment

## Overview

```
Browser ──► quizco-sandy.vercel.app   (frontend, Vercel)
              │
              └──► quizco.onrender.com (backend, Render) ──► MongoDB Atlas
```

| Part | Host | URL | Source |
|---|---|---|---|
| Frontend (React + Vite) | Vercel | https://quizco-sandy.vercel.app | `frontend/` |
| Backend (Express + Socket.IO) | Render | https://quizco.onrender.com | `backend/` |
| Database | MongoDB Atlas | set by `MONGO_URI` | — |
| Uptime monitor | UptimeRobot | pings `/search` | — |

## Frontend (Vercel)

- Built with `npm run build` (`tsc -b && vite build`).
- `frontend/vercel.json` holds the Vercel config.
- Environment variables (set these in the Vercel dashboard):
  - `VITE_API_URL`: backend URL for HTTP requests (`https://quizco.onrender.com`)
  - `VITE_SERVER_URL`: backend URL for Socket.IO (`https://quizco.onrender.com`)
  - `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

## Backend (Render)

- Build: `npm install && npm run build` (compiles `src/` to `dist/`)
- Start: `npm start` (`node dist/index.js`)
- Environment variables (set these in the Render dashboard; see `backend/.env.example`):
  - `MONGO_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: secret used to sign auth tokens
  - `GOOGLE_CLIENT_ID`: Google OAuth client ID
  - `PORT`: Render sets this automatically (falls back to 3000 locally)
- CORS only allows requests from `https://quizco-sandy.vercel.app`
  (`backend/src/managers/IoManager.ts`).

### Why Render and not Vercel for the backend?

Vercel runs serverless functions, which can't hold the long-lived WebSocket
connections Socket.IO needs for live quizzes. Render runs the backend as an
always-on server, so those connections work.

## The `/search` route (health check)

Despite its name, `/search` is a **health check**, not a search endpoint.
It's defined in `backend/src/index.ts`.

It checks that the server is running and pings MongoDB:

| Situation | Status | Response |
|---|---|---|
| Server up, DB reachable | `200` | `{"ok":true,"db":"up"}` |
| Server up, DB down | `503` | `{"ok":false,"db":"down"}` |
| Server down / crashed | no response / timeout | — |

### Why it exists

UptimeRobot calls it every 5 minutes to:

1. **Keep Render awake.** On the free tier, Render puts the service to sleep after
   about 15 minutes with no traffic, and the first request after that is slow
   (30–60 seconds).
2. **Keep Atlas active.** The ping counts as regular database activity.
3. **Send alerts.** A `503` or a timeout tells you the database or the server is down.

### How to check it

```bash
# Production
curl -i https://quizco.onrender.com/search

# Local (after `npm run build && npm start` in backend/)
curl -i http://localhost:3000/search
```

You can also just open the URL in a browser.

### UptimeRobot settings

- Monitor type: HTTP(s)
- URL: `https://quizco.onrender.com/search`
- Interval: 5 minutes

## Local development

| Part | Command | URL |
|---|---|---|
| Backend | `cd backend && npm run build && npm start` | http://localhost:3000 |
| Frontend | `cd frontend && npm start` | http://localhost:5173 |

They use different ports because they're two separate servers, and each port
can only be used by one program at a time. For local development, point
`frontend/.env` at `http://localhost:3000` (see `frontend/.env.example`).

> **Note:** backend CORS currently only allows the Vercel domain, so the browser
> blocks requests from `localhost:5173`. Add `http://localhost:5173` to the allowed
> origins in `backend/src/managers/IoManager.ts` when developing locally.
