# auth-service

**What it does:** Signup and login. Issues JWT; validates credentials against MongoDB.

**Connections:**
- **MongoDB** — `MONGO_URI` (from secret `auth-secrets`). Uses `User` model.
- **Ingress:** `/api/auth`, `/health` (health is routed here for backend check).

**Port:** 3000  
**Env:** `MONGO_URI`, `JWT_SECRET` (both from `auth-secrets`). See `.env.example`.

**Routes:** `POST /api/auth/signup`, `POST /api/auth/login`. `GET /health` returns 200.
