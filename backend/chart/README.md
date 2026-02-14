# whiteboard-backend Helm Chart

Deploys all backend microservices (auth, rooms, drawings, messages, realtime) plus optional Ingress. **Primary way to deploy** the backend.

## Prerequisites

- Kubernetes cluster (e.g. `kind create cluster --name whiteboard`)
- Secret `auth-secrets` in namespace `whiteboard` with keys `MONGO_URI` and `JWT_SECRET`
- Images built and loaded (e.g. into Kind): `auth-service:latest`, `rooms-service:latest`, etc.
- Optional: Ingress controller (e.g. ingress-nginx) if using Ingress

## Install

```bash
# 1. Create namespace and secret (once)
kubectl create namespace whiteboard
kubectl create secret generic auth-secrets -n whiteboard \
  --from-literal=MONGO_URI='mongodb+srv://...' \
  --from-literal=JWT_SECRET=your-secret

# 2. Build and load images (from repo root; repeat per service)
docker build -t auth-service:latest -f whiteboardK8s/backend/auth-service/Dockerfile whiteboardK8s/backend/auth-service
kind load docker-image auth-service:latest --name whiteboard
# Same for rooms-service, drawings-service, messages-service, realtime-service

# 3. Install the chart (creates namespace via chart if you use --create-namespace)
cd whiteboardK8s/backend
helm install backend ./chart --create-namespace -n whiteboard
```

## Upgrade

```bash
helm upgrade backend ./chart -n whiteboard
```

Override values (e.g. new image tag):

```bash
helm upgrade backend ./chart -n whiteboard --set auth.tag=v2
```

## Uninstall

```bash
helm uninstall backend -n whiteboard
```

## Values

| Value | Default | Description |
|-------|---------|-------------|
| `namespace` | whiteboard | Namespace for all resources |
| `secretName` | auth-secrets | Secret with MONGO_URI, JWT_SECRET |
| `ingress.enabled` | true | Deploy Ingress (set false if no controller) |
| `auth.image`, `auth.tag`, `auth.port`, `auth.replicas` | auth-service, latest, 3000, 1 | Auth service |
| `rooms.*` | ... | Rooms service |
| `drawings.*` | ... | Drawings service |
| `messages.*` | ... | Messages service |
| `realtime.*` | ... | Realtime service |

Disable Ingress (e.g. no controller):

```bash
helm install backend ./chart -n whiteboard --set ingress.enabled=false
```
