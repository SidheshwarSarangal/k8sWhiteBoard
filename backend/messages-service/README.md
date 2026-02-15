# messages-service

**What it does:** Send chat message, get messages by room.

**Connections:**
- **MongoDB** — `MONGO_URI` (from `auth-secrets`). Uses `Message` model.
- **Ingress:** `/api/messages`.

**Port:** 3003  
**Env:** `MONGO_URI`, `JWT_SECRET` (from `auth-secrets`). See `.env.example`.

**Routes:** `POST /`, `GET /:roomId`. Both require JWT.
