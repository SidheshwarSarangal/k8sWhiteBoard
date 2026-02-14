# Drawings Service

Whiteboard drawings microservice: save stroke, get drawings by room, delete stroke, clear all in room. All routes require Bearer token.

## Run locally (no Docker/K8s)

1. Copy `.env.example` to `.env`, set `MONGO_URI` and `JWT_SECRET`.
2. MongoDB must be reachable (same Atlas DB).
3. `npm install && npm start` — listens on port 3002.

## Deploy on kind (after cluster and secret exist)

1. Build and load image:
   ```bash
   docker build -t drawings-service:latest .
   kind load docker-image drawings-service:latest --name whiteboard
   ```

2. Deploy:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. Test:
   ```bash
   kubectl port-forward svc/drawings-service 3002:3002 -n whiteboard
   curl http://localhost:3002/health
   ```

## Endpoints (all require Authorization: Bearer <token>)

- `GET /health` — health check (no auth)
- `POST /api/drawings` — save stroke (body: roomId, strokeData)
- `GET /api/drawings/:roomId` — get all drawings for room
- `DELETE /api/drawings/:id` — delete one stroke
- `DELETE /api/drawings/all/:roomId` — clear all drawings in room
