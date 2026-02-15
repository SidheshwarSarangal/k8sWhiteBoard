# frontend

**What it does:** React SPA — sign-in/sign-up, home, rooms, whiteboard canvas, real-time drawing and chat via Socket.IO.

**Connections:**
- **API** — `API_BASE` (from `VITE_API_URL` at build time). Empty = same origin; used for `/api/auth`, `/api/rooms`, `/api/drawings`, `/api/messages`, `/api/users`.
- **Socket.IO** — `SOCKET_URL` (same as `API_BASE` or `window.location.origin`). Single realtime-service behind Ingress path `/socket.io`.
- **Served in cluster:** nginx on port 80; Ingress path `/` → this service.

**Build:** `VITE_API_URL` set only when API is on a different host; for same-origin Ingress leave unset. See `.env.example`.

**Deploy:** Dockerfile (build + nginx); chart or `k8s/` use namespace `whiteboard-frontend`.
