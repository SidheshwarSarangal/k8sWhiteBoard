# Kubernetes concepts through this project

[← Documentation home](../README.md)

## The building analogy

```mermaid
flowchart TD
    Building[Kind cluster<br/>the building]
    Building --> Floors[Namespaces<br/>separate floors]
    Floors --> Managers[Deployments<br/>team managers]
    Managers --> Workers[Pods<br/>running workers]
    Workers --> Desks[Services<br/>stable desk numbers]
    Entrance[Ingress<br/>reception desk] --> Desks
    Blueprint[Helm<br/>building blueprint] --> Building
    Safe[Secret<br/>locked envelope] --> Workers
```

| Object | What Kubernetes does | Project example |
|---|---|---|
| Cluster | Provides the full runtime | Kind cluster named `whiteboard` |
| Namespace | Groups and isolates names | `whiteboard-backend`, `whiteboard-frontend` |
| Deployment | Maintains desired pod count | One Deployment per service |
| Pod | Runs a container | One current replica per workload |
| Service | Gives pods a stable internal endpoint | `drawings-service:3002` |
| Ingress | Exposes HTTP paths | `/api/drawings` → drawings Service |
| Secret | Injects sensitive configuration | `MONGO_URI`, `JWT_SECRET` |
| Probe | Checks if a container is usable | Backend `/health` checks |

## Deployment controls

```mermaid
flowchart LR
    Desired[values.yaml<br/>replicas: 1] --> Deployment
    Deployment --> Pod[Running pod]
    Pod --> Ready{Readiness passes?}
    Ready -- Yes --> Service[Receive traffic]
    Ready -- No --> Wait[Stay out of Service]
    Pod --> Alive{Liveness passes?}
    Alive -- No --> Restart[Kubernetes restarts container]
```

## Networking controls

```mermaid
flowchart LR
    Outside[Browser] --> Ingress
    Ingress --> Service[ClusterIP Service]
    Service --> Pod

    Pod --> DNS[Service-name DNS]
    DNS --> Mongo[mongodb:27017]
```

ClusterIP Services are internal. Ingress is the HTTP entry point exposed through Kind’s port mappings.
