# Local development

[← Documentation home](../README.md)

Kubernetes is optional while developing service code.

## Local topology

```mermaid
flowchart LR
    Frontend[React / Vite] --> A[Auth :3000]
    Frontend --> R[Rooms :3001]
    Frontend --> D[Drawings :3002]
    Frontend --> M[Messages :3003]
    Frontend --> L[Realtime :3004]
    Frontend --> U[Users :3005]
    A & R & D & M & U --> Mongo[(MongoDB)]
```

Each backend service has its own `.env.example` and `npm start` command.

## Configuration

| Service | Required values |
|---|---|
| Auth | `PORT`, `MONGO_URI`, `JWT_SECRET` |
| Rooms | `PORT`, `MONGO_URI`, `JWT_SECRET` |
| Drawings | `PORT`, `MONGO_URI`, `JWT_SECRET` |
| Messages | `PORT`, `MONGO_URI`, `JWT_SECRET` |
| Realtime | `PORT`; optional `REDIS_URL` |
| Users | `PORT`, `MONGO_URI` |
| Frontend | optional build-time `VITE_API_URL` |

```mermaid
flowchart LR
    Empty[VITE_API_URL empty] --> Same[Use browser origin]
    Set[VITE_API_URL set] --> Custom[Use specified API + Socket URL]
```

Because the frontend expects one base URL, local microservices need a reverse proxy/Ingress-style router or a shared gateway address. Running six ports alone is not enough for the current frontend routing model.
