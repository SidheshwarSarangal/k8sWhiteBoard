# Rooms Service

Whiteboard rooms microservice: create room, get room, get rooms by owner, join room (public/private), update password.

## Run locally (no Docker/K8s)

1. Copy `.env.example` to `.env`, set `MONGO_URI` and `JWT_SECRET`.
2. MongoDB must be reachable (same Atlas DB as auth).
3. `npm install && npm start` — listens on port 3001.

## Deploy on kind (after cluster and secret exist)

1. Build and load image:
   ```bash
   docker build -t rooms-service:latest .
   kind load docker-image rooms-service:latest --name whiteboard
   ```

2. Deploy (namespace `whiteboard` and secret `auth-secrets` must exist):
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. Test:
   ```bash
   kubectl port-forward svc/rooms-service 3001:3001 -n whiteboard
   curl http://localhost:3001/health
   ```

## Endpoints

- `GET /health` — health check
- `POST /api/rooms` — create room (body: roomId, name, isPrivate, owner, description)
- `GET /api/rooms/:id` — get room by roomId
- `GET /api/rooms/private/:id` — get room (requires Bearer token)
- `GET /api/rooms/getRoomsByOwner?owner=username` — list rooms by owner
- `PUT /api/rooms/rooms/:roomId` — update room password (body: password)
- `POST /api/rooms/join` — join room (body: roomId, username, password?)
