# Whiteboard on Kubernetes

**A real-time collaborative whiteboard rebuilt as independently managed microservices inside Kubernetes.**

Users still create rooms, draw together, control access, and export boards. Kubernetes changes how those capabilities are packaged, routed, monitored, and operated.

## Product experience

```mermaid
flowchart LR
    A[Person A] --> Room[Shared room]
    B[Person B] --> Room
    Viewer[View-only guest] --> Room

    Room --> Draw[Draw + write]
    Room --> Live[See changes live]
    Room --> Access[Public / private access]
    Room --> Export[PNG / JPG / PDF]
```

## Why Kubernetes?

The original application uses one backend. This version gives each responsibility its own service.

```mermaid
flowchart LR
    Original[One backend] --> Split{Split by responsibility}
    Split --> Auth[Accounts]
    Split --> Rooms[Rooms]
    Split --> Drawings[Drawings]
    Split --> Messages[Messages]
    Split --> Realtime[Live events]
    Split --> Users[User profiles]

    Kubernetes[Kubernetes] --> Manage[Runs + monitors each service]
    Manage --> Split
```

This makes service boundaries visible and allows each part to be deployed or scaled independently.

## Complete system

```mermaid
flowchart LR
    Browser[Browser] --> Entry[NGINX Ingress<br/>ports 80 / 443]

    subgraph FrontNS[whiteboard-frontend]
        Frontend[React + nginx]
    end

    subgraph BackNS[whiteboard-backend]
        Auth[Auth :3000]
        Rooms[Rooms :3001]
        Drawings[Drawings :3002]
        Messages[Messages :3003]
        Realtime[Realtime :3004]
        Users[Users :3005]
        Secret[auth-secrets]
        Mongo[(MongoDB or Atlas)]
    end

    Entry --> Frontend
    Entry --> Auth & Rooms & Drawings & Messages & Realtime & Users
    Auth & Rooms & Drawings & Messages & Users --> Mongo
    Secret -. configuration .-> Auth & Rooms & Drawings & Messages & Users
```

Two namespace-scoped Ingress resources define the routes, while the NGINX Ingress Controller exposes them through the same cluster entry address.

## One address, seven destinations

```mermaid
flowchart TD
    URL[http://localhost] --> Router{Request path}
    Router -->|/| Frontend[Frontend]
    Router -->|/api/auth| Auth[Auth service]
    Router -->|/api/rooms| Rooms[Rooms service]
    Router -->|/api/drawings| Drawings[Drawings service]
    Router -->|/api/messages| Messages[Messages service]
    Router -->|/api/users| Users[Users service]
    Router -->|/socket.io| Realtime[Realtime service]
```

The browser does not need to know individual service ports. Ingress reads the path and chooses the destination.

## Real-time drawing path

```mermaid
sequenceDiagram
    actor A as Person A
    participant UI as React canvas
    participant Draw as Drawings service
    participant DB as MongoDB
    participant Live as Realtime service
    actor B as Person B

    A->>UI: Draw stroke
    UI->>Draw: Save with JWT
    Draw->>DB: Persist stroke
    DB-->>UI: Saved stroke ID
    UI->>Live: Emit Socket.IO event
    Live-->>B: Broadcast stroke
```

MongoDB keeps the drawing for later; Socket.IO makes it appear immediately for connected users.

## Kubernetes in plain language

| Kubernetes object | Role in this project |
|---|---|
| Container | Packaged frontend or microservice |
| Pod | One running copy of a container |
| Deployment | Keeps the requested pod count healthy |
| Service | Stable internal address for a pod |
| Ingress | Routes browser paths to Services |
| Namespace | Separates frontend and backend resources |
| Secret | Supplies MongoDB and JWT configuration |
| Helm | Primary installation and upgrade blueprint |
| Kustomize | Smaller alternative/reference deployment |
| Kind | Runs the Kubernetes cluster locally in Docker |

## Deployment journey

```mermaid
flowchart LR
    Source[Source code] --> Images[7 Docker images]
    Images --> Kind[Load into Kind]
    Secret[Create Secret] --> Helm
    Kind --> Helm[Install Helm chart]
    Helm --> Objects[Deployments + Services + Ingress]
    Objects --> Probes[Health checks]
    Probes --> Ready[Open localhost]
```

Helm is the complete route. Kustomize is retained as an alternative backend reference and does not include the users service or frontend.

## Documentation map

| Guide | Covers |
|---|---|
| [Architecture](docs/architecture.md) | Namespaces, workloads, networking and dependencies |
| [Service catalog](docs/services.md) | Every microservice, route, port and data owner |
| [Request flows](docs/request-flows.md) | Login, rooms, drawing, realtime and view-only paths |
| [Kubernetes concepts](docs/kubernetes-concepts.md) | Kubernetes objects explained through this project |
| [Helm deployment](docs/helm-deployment.md) | Complete build, install, verify, upgrade and teardown |
| [Kustomize deployment](docs/kustomize-deployment.md) | Alternative path and its exact scope |
| [Data and security](docs/data-and-security.md) | MongoDB, JWT, Secrets and access boundaries |
| [Operations](docs/operations.md) | Probes, scaling, Redis, resources and troubleshooting |
| [Local development](docs/local-development.md) | Run services without Kubernetes |
| [Current implementation](docs/current-implementation.md) | Verified gaps and production next steps |

## Quick deployment outline

```bash
kind create cluster --name whiteboard --config kind-config.yaml
```

```bash
# Build the seven images, load them into Kind, create auth-secrets,
# then install the complete chart:
cd backend
helm install whiteboard ./chart -n whiteboard-backend
```

Follow the ordered [Helm deployment guide](docs/helm-deployment.md); the Secret and image-loading steps are required.

## Related study

- [Original whiteboard application](https://github.com/SidheshwarSarangal/whiteBoard)
- [Step-by-step Kubernetes study](https://github.com/SidheshwarSarangal/study-of-k8s-method-project-of-white-board)
