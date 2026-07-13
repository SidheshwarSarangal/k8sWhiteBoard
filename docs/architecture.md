# Architecture

[← Documentation home](../README.md)

## Layered view

```mermaid
flowchart TB
    User[Browser]

    subgraph Edge[Cluster edge]
        Ports[Kind ports 80 / 443]
        Nginx[NGINX Ingress Controller]
    end

    subgraph Front[whiteboard-frontend namespace]
        FI[Frontend Ingress]
        FS[Frontend ClusterIP Service]
        FP[Frontend Pod<br/>nginx + React]
    end

    subgraph Back[whiteboard-backend namespace]
        BI[Backend Ingress]
        BS[6 ClusterIP Services]
        BP[6 backend Pods]
        Secrets[auth-secrets]
        Mongo[(Optional MongoDB Pod)]
    end

    User --> Ports --> Nginx
    Nginx --> FI --> FS --> FP
    Nginx --> BI --> BS --> BP
    Secrets -. env values .-> BP
    BP --> Mongo
```

Ingress resources can only reference Services in their own namespace, so the chart creates one frontend Ingress and one backend Ingress.

## Workload inventory

```mermaid
flowchart LR
    subgraph FrontendNS[whiteboard-frontend]
        FDep[frontend Deployment] --> FPod[frontend Pod]
        FService[frontend Service] --> FPod
    end

    subgraph BackendNS[whiteboard-backend]
        ADep[auth Deployment] --> APod[auth Pod]
        RDep[rooms Deployment] --> RPod[rooms Pod]
        DDep[drawings Deployment] --> DPod[drawings Pod]
        MDep[messages Deployment] --> MPod[messages Pod]
        LDep[realtime Deployment] --> LPod[realtime Pod]
        UDep[users Deployment] --> UPod[users Pod]
    end
```

Every Deployment currently requests one replica. Every workload has a matching ClusterIP Service.

## Dependency map

```mermaid
flowchart TD
    Frontend --> Auth & Rooms & Drawings & Users & Realtime
    Auth --> UserData[(users collection)]
    Users --> UserData
    Rooms --> RoomData[(rooms collection)]
    Drawings --> DrawingData[(drawings collection)]
    Messages --> MessageData[(messages collection)]
    Realtime --> Memory[In-memory Socket.IO rooms]
    Realtime -. optional .-> Redis[(Redis adapter)]
```

Auth and users intentionally share the same MongoDB user collection through compatible schemas.

## Repository structure

```text
k8sWhiteBoard/
├── frontend/                 # React app, nginx image, optional raw manifests
├── backend/
│   ├── *-service/            # Six Node.js microservices
│   ├── chart/                # Complete Helm deployment
│   └── k8s/                  # Kustomize reference + MongoDB manifest
└── kind-config.yaml          # Local cluster and host port mapping
```
