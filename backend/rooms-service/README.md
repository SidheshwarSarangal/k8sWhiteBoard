# rooms-service

**What it does:** Create room, get room by id, list rooms by owner, update room password, join room.

**Connections:**
- **MongoDB** — `MONGO_URI` (from `auth-secrets`). Uses `Room` model.
- **Ingress:** `/api/rooms`.

**Port:** 3001  
**Env:** `MONGO_URI`, `JWT_SECRET` (from `auth-secrets`). See `.env.example`.

**Routes:** `POST /`, `GET /getRoomsByOwner`, `GET /:id`, `GET /private/:id`, `PUT /rooms/:roomId`, `POST /join`. JWT required on some routes (see middleware).
