# FleetPulse TMS — Frontend

A trucking management and ELD (Electronic Logging Device) compliance platform built with **React + TypeScript + Tailwind CSS**. Drivers can plan routes on a live map, fill FMCSA-compliant driver daily logs, and admins can monitor everything from a central dashboard.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS + injected scoped CSS (no globals.css) |
| Routing | React Router v6 |
| HTTP | Axios with request/response interceptors |
| Map | Leaflet + OpenStreetMap (free, no API key) |
| Routing Engine | OSRM public API (free, no API key) |
| Charts | Recharts (HOS activity graph) |
| Fonts | Syne (display) + DM Sans (body) + JetBrains Mono |

---

## Project Structure

```
src/
├── middleware/
│   └── axiosinterceptor.tsx     # Axios instance — auto Bearer token + 401 redirect
├── utils/
│   ├── logout.ts                # logout(), getAccessToken(), getStoredUser()
│   └── axiosInstance.ts         # (alternate interceptor, same pattern)
├── components/
│   ├── Navbar.tsx               # Shared top nav with dropdowns
│   └── Footer.tsx               # Shared footer
├── pages/
│   ├── home.tsx                 # Landing / home page
│   ├── LoginPage.tsx            # Sign in — role-based redirect
│   ├── RegisterPage.tsx         # Sign up — full serializer validation
│   ├── UserVerified.tsx         # Post email-verification success
│   ├── ForgotPassword.tsx       # Request reset email
│   ├── ForgotPasswordConfirm.tsx# Set new password (reads ?user_id=&token=)
│   ├── RoutePage.tsx            # Leaflet map — plan & save routes
│   ├── DriverLogPage.tsx        # ELD daily log form with HOS grid
│   ├── Dashboard.tsx            # Admin dashboard — routes, logs, users
│   └── NotFound.tsx             # 404 catch-all
└── App.tsx                      # Router with bare-route layout logic
```

---

## Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

> All Vite env vars must be prefixed with `VITE_` to be exposed to the browser.  
> Change the value to your production URL before deploying.

---

## Installation

```bash
# Install dependencies
npm install

# Install map library
npm install leaflet @types/leaflet

# Start dev server
npm run dev
```

---

## API Endpoints Used

| Method | URL | Page | Auth |
|---|---|---|---|
| `POST` | `/auth/login/` | LoginPage | ❌ |
| `POST` | `/auth/create_users/` | RegisterPage | ❌ |
| `GET` | `/auth/verify_users/:id/:token/` | UserVerified | ❌ |
| `POST` | `/auth/forgot-password/` | ForgotPassword | ❌ |
| `PUT` | `/auth/forgot-password-confirm/:user_id/:token/` | ForgotPasswordConfirm | ❌ |
| `POST` | `/route/create/` | RoutePage | ✅ |
| `GET` | `/route/list/` | Dashboard | ✅ |
| `POST` | `/log/create/` | DriverLogPage | ✅ |
| `GET` | `/log/list/` | Dashboard | ✅ |
| `GET` | `/auth/list_users/` | Dashboard | ✅ |

---

## Authentication Flow

1. User logs in → `access_token`, `first_name`, `last_name`, `email`, `user_id` saved to `localStorage`
2. Every authenticated request has `Authorization: Bearer <token>` attached automatically by the Axios interceptor
3. If the backend returns `401 token_not_valid` (expired token), the interceptor clears storage and redirects to `/`
4. Logout clears all keys from both `localStorage` and `sessionStorage`

### Role-based redirect after login

| Role | Redirects to |
|---|---|
| `driver` | `/route` |
| `admin` | `/dashboard` |

---

## Route → Driver Log Flow

The driver log is linked to a route via a foreign key. The correct flow is:

```
1. /route      → Place pins → Save route → Backend returns route ID
2. Click "Create Driver Log" button (appears after save)
3. /driver-log → Form pre-linked to route ID → Submit logs
```

> Navigating to `/driver-log` directly without a saved route will show a warning banner and block submission.

---

## Pages Overview

### LoginPage `/login`
Email + password login with Google/Microsoft social buttons (UI only), show/hide password, remember me checkbox, field-level and server error display.

### RegisterPage `/register`
Full registration form with all Django serializer validations mirrored on the frontend: name length/special chars, email regex, password strength (8–16 chars, uppercase, special char), role dropdown (Driver / Admin), optional passport field. 5-second countdown redirect to login on success.

### ForgotPassword `/forgot-password`
Email input → POST to backend → animated envelope success state with step-by-step instructions.

### ForgotPasswordConfirm `/forgot-password-confirm/`
Reads `?user_id=&token=` from query params (sent by Django email template). Password strength bar, live requirements checklist, match indicator. Shows invalid-link state if params are missing.

### RoutePage `/route`
Full-screen Leaflet map with sidebar controls:
- Three pin types: Current (amber), Pickup (green), Dropoff (red)
- GPS auto-locate via browser geolocation
- Click-to-place and drag-to-reposition markers
- OSRM route drawing with distance + ETA stats
- Save route to backend → "Create Driver Log" button appears

### DriverLogPage `/driver-log`
Multi-log ELD form per the FMCSA Driver's Daily Log format:
- Interactive HOS grid (96 cells × 4 status rows — click/drag to paint)
- Recharts `stepAfter` line chart showing 24-hour activity
- Auto-computed total hours per status
- Multiple log entries per route submission
- Linked to route via `route` FK field in payload

### Dashboard `/dashboard`
Admin overview with sidebar navigation and three data tables — Routes, Driver Logs, Users — each with independent server-side pagination, loading states, and empty states.

### UserVerified `/verified`
Post email-verification success page with animated checkmark, 3-step status list, and 8-second countdown auto-redirect to home.

### NotFound `/*`
404 catch-all with animated truck, glitch "404" text, terminal block showing the attempted path, and quick-nav links.

---

## Key Design Decisions

**No `globals.css`** — Each page injects its own scoped `<style>` tag on mount and removes it on unmount. CSS class names are prefixed per page (`lp-`, `rp-`, `fp-`, `dl-`, `db-`) to prevent collisions.

**Bare routes** — Pages with their own full-screen layouts (login, register, map, dashboard, etc.) are excluded from the shared `<Navbar>` / `<Footer>` wrapper in `App.tsx`.

**GeoJSON coordinate order** — Leaflet uses `[lat, lng]` but GeoJSON (and Django's backend) expects `[lng, lat]`. The `RoutePage` converts correctly before sending to the API.

**`many=True` driver logs** — The `/log/create/` endpoint accepts an array. The frontend always sends an array even for a single log entry.

---

## License

Internal use — FleetPulse Inc.