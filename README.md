# CivicLens

**Turn everyday problems into actionable solutions.**

CivicLens lets anyone photograph a local problem (a pothole, a dead streetlight, a leaking pipe). AI reads the photo, scores how much it matters to the neighbourhood, writes a structured complaint, suggests who should handle it, and tracks the issue until it is resolved.

> Built as a hackathon prototype. Authority routing is placeholder data and does not send anything to a government system.

## The problem

Civic problems are easy to notice but hard to report: filing is slow, nothing tells authorities what is urgent, and citizens never see whether anything happened.

## How it works

```
Photo -> AI identifies the issue -> Location + category -> Civic Impact Score
      -> Auto-generated complaint -> Suggested authority -> Status tracking
```

### Civic Impact Score

Every issue gets a transparent score from 0 to 100:

| Component | Max points | Meaning |
|---|---|---|
| Visible severity | 40 | How bad the damage looks in the photo |
| People exposed | 20 | How busy the place is |
| Safety risk | 20 | Danger to life or limb |
| Community confirmations | 20 | Independent reports of the same issue |

Priority bands: **LOW** 0-34, **MEDIUM** 35-54, **HIGH** 55-69, **CRITICAL** 70+.
The UI shows how each score adds up, so the ranking is explainable, not a black box.

### Crowd verification

If a new photo matches an open issue of the same category within 75 m, the app flags a likely duplicate. Users can add their report to the existing issue instead of filing a copy. The score rises with each confirmation, and three independent reports mark the issue **Verified** automatically.

### Lifecycle

`Reported -> Verified -> Assigned -> In Progress -> Resolved`, with a timestamped history. Authorities update status from a key-protected view.

## Features

- Camera capture or image upload, resized in the browser before upload
- Geolocation with a readable address (OpenStreetMap)
- Multimodal AI analysis returned as strict JSON
- Civic Impact Score with a visible breakdown
- Auto-generated complaint text and suggested authority
- Duplicate detection and community verification
- Community board with status filters and sorting
- Authority view for status updates
- Impact dashboard with resolution rate and a live map
- Demo Mode: works without an API key using a simulated AI result

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Leaflet |
| Backend | Node.js, Express, Multer |
| AI | Multimodal model via the Anthropic Messages API |
| Data | JSON file store (swap `server/db.js` for Supabase/PostgreSQL) |
| Maps | OpenStreetMap tiles and reverse geocoding |

## Getting started

Requires **Node.js 18+**.

```bash
git clone <https://github.com/choudharyanushka2323-sudo/civiclens.git>
cd civiclens
npm run install:all
cp server/.env.example server/.env
```

Edit `server/.env`:

| Variable | Purpose | Default |
|---|---|---|
| `ANTHROPIC_API_KEY` | Enables live photo analysis. Leave empty for Demo Mode. | empty |
| `ANTHROPIC_MODEL` | Model used for analysis | `claude-sonnet-4-6` |
| `ADMIN_KEY` | Key for the authority view | `civiclens-demo` |
| `PORT` | Server port | `8787` |

Run in development (two terminals):

```bash
npm run dev:server   # API on http://localhost:8787
npm run dev:client   # app on http://localhost:5173
```

Open **http://localhost:5173**.

## Deployment (single service)

```bash
npm run install:all && npm run build
npm start            # Express serves the API and the built frontend on one port
```

On Render, Railway or Fly, create one Node web service:

- Build command: `npm run install:all && npm run build`
- Start command: `npm start`
- Environment variables: `ANTHROPIC_API_KEY`, `ADMIN_KEY`

Camera and location need HTTPS, which these hosts provide. The JSON store and uploaded photos live on local disk, so on hosts with ephemeral disks they reset on redeploy.

## Project structure

```
civiclens/
  client/                React + Vite frontend
    src/
      App.jsx            Shell, navigation, landing page
      ReportFlow.jsx     Capture, analyze, review, submit
      Dashboard.jsx      Community board and issue detail
      Impact.jsx         Stats, category chart, map
      MapView.jsx        Leaflet map
      ui.jsx             Score sign, lifecycle, breakdown
      api.js             API client, image resize, geocoding
  server/
    index.js             Routes, duplicate detection, report text
    ai.js                Multimodal analysis, prompt, demo fallback
    scoring.js           Civic Impact Score, distance calculation
    db.js                JSON file store
```

## API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Multipart `image`, `lat`, `lng`. Returns analysis, score, authority, nearby duplicates |
| POST | `/api/reports` | Submit a report |
| POST | `/api/reports/:id/confirm` | Add your report to an existing issue |
| PATCH | `/api/reports/:id/status` | Change status (header `x-admin-key`) |
| GET | `/api/reports` | List reports |
| GET | `/api/reports/:id` | One report |
| GET | `/api/stats` | Dashboard numbers |
| GET | `/api/health` | AI mode and server status |

## Demo walkthrough

1. Open the app and click **Report a problem**.
2. Upload a photo of a pothole. Location attaches automatically.
3. Click **Analyze photo** and review the Civic Impact Score and its breakdown.
4. Click **Submit report** and view the generated complaint.
5. Upload a second photo of the same spot. Accept the duplicate prompt and watch the score rise.
6. Click **Authority login** (key `civiclens-demo`), open the issue, and move it to **Resolved**.
7. Open the **Impact** tab for the resolution rate and map.

## Limitations

- Authority routing is a placeholder table, not a government integration.
- Sign-in is a demo authority key, not full user accounts.
- AI severity is an estimate from a single photo; humans should verify.
- Data is stored in a local JSON file.

## Roadmap

- Real user accounts and a hosted database
- Pilot with one municipal ward and real department contacts
- Local languages and WhatsApp photo intake
- Before-and-after photos to confirm a fix



