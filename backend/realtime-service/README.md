# Realtime Service

Socket.IO microservice for whiteboard: drawing sync, room join/leave, chat. No MongoDB; optional Redis for multi-replica.

## Events

- **join_room** — client sends `{ roomId, username }`; server joins socket to room, broadcasts `user_joined`.
- **drawing** — client sends `{ roomId, stroke }`; server broadcasts to others in room.
- **drawing_deleted** — client sends `{ roomId, strokeId }`; server broadcasts.
- **clear_canvas** — client sends `{ roomId }`; server broadcasts `canvas_cleared`.
- **get_users** — client sends `roomId`, callback returns list of socket IDs in room.
- **send_message** — client sends `{ roomId, message }`; server broadcasts `receive_message`.

## Run locally (no Docker/K8s)

1. Copy `.env.example` to `.env` if you need REDIS_URL.
2. `npm install && npm start` — listens on port 3004. Frontend connects to `http://localhost:3004` for Socket.IO.

## Deploy on kind

1. `docker build -t realtime-service:latest .`
2. `kind load docker-image realtime-service:latest --name whiteboard`
3. `kubectl apply -f k8s/deployment.yaml` and `kubectl apply -f k8s/service.yaml`

For **multiple replicas** (e.g. HPA), run Redis in the cluster, create a secret with `REDIS_URL`, and set it in deployment env so the Redis adapter is used.

## Endpoints

- `GET /health` — health check
