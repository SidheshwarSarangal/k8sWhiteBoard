# Messages Service

Whiteboard chat microservice: send message, get messages by room. All routes require Bearer token.

## Run locally (no Docker/K8s)

1. Copy `.env.example` to `.env`, set `MONGO_URI` and `JWT_SECRET`.
2. `npm install && npm start` — listens on port 3003.

## Deploy on kind

1. `docker build -t messages-service:latest .`
2. `kind load docker-image messages-service:latest --name whiteboard`
3. `kubectl apply -f k8s/deployment.yaml` and `kubectl apply -f k8s/service.yaml`

## Endpoints (require Authorization: Bearer <token>)

- `GET /health` — health check (no auth)
- `POST /api/messages` — send message (body: roomId, sender, text)
- `GET /api/messages/:roomId` — get messages for room
