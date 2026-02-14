# Backend (microservices)

All services run in **one namespace**: `whiteboard`.

## Deploy order (after kind cluster is up)

1. **Create namespace once** (from this folder):
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Create secret** (MONGO_URI, JWT_SECRET) — see auth-service README.

3. **Build, load, and deploy each service** (auth, rooms, drawings, messages, realtime) — see each service’s README.

## Services

| Service         | Port | Path           |
|----------------|------|----------------|
| auth-service   | 3000 | auth-service/  |
| rooms-service  | 3001 | rooms-service/ |
| drawings-service | 3002 | drawings-service/ |
| messages-service | 3003 | messages-service/ |
| realtime-service | 3004 | realtime-service/ |

All use namespace `whiteboard`; namespace is defined in `k8s/namespace.yaml` (this folder).
