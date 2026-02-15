# users-service

**What it does:** Add room to user’s collaborations, get user’s collabs, get user by username.

**Connections:**
- **MongoDB** — `MONGO_URI` (from `auth-secrets`). Uses `User` model.
- **Ingress:** `/api/users`.

**Port:** 3005  
**Env:** `MONGO_URI`, `JWT_SECRET` (from `auth-secrets`). See `.env.example`.

**Routes:** `POST /add-room-to-collabs`, `GET /collabs/:username`, `GET /by-username/:username`. No JWT on these (frontend calls for profile/collabs).
