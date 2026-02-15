# realtime-service

**What it does:** Socket.IO server for real-time drawing, room join/leave, chat, and user list in a room.

**Connections:**
- **No MongoDB.** Optional **Redis** — `REDIS_URL` for multi-replica Socket.IO adapter; if unset, in-memory (single replica).
- **Ingress:** `/socket.io`.
- **Clients:** Browser connects to same origin (or `SOCKET_URL`); joins rooms and emits drawing/chat/room events.

**Port:** 3004  
**Env:** `REDIS_URL` (optional). See `.env.example`.

**Events:** `drawing`, `drawing_deleted`, `clear_canvas`; `join_room`, `user_joined`, `user_left`; `send_message`, `receive_message`; `get_users`.
