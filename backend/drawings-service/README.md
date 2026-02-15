# drawings-service

**What it does:** Save stroke, get drawings by room, delete stroke, clear all drawings in a room.

**Connections:**
- **MongoDB** — `MONGO_URI` (from `auth-secrets`). Uses `Drawing` model.
- **Ingress:** `/api/drawings`.

**Port:** 3002  
**Env:** `MONGO_URI`, `JWT_SECRET` (from `auth-secrets`). See `.env.example`.

**Routes:** `POST /`, `GET /:roomId`, `DELETE /:id`, `DELETE /all/:roomId`. All require JWT.
