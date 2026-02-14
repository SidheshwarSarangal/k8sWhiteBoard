# whiteboard-backend Helm Chart

Deploys all backend microservices (auth, rooms, drawings, messages, realtime) plus optional Ingress. **Primary way to deploy** the backend.

## Prerequisites

- Kubernetes cluster (e.g. `kind create cluster --name whiteboard`)
- Secret `auth-secrets` in namespace **whiteboard-backend** with keys `MONGO_URI` and `JWT_SECRET` (create after first install or create namespace first)
- Images built and loaded (e.g. into Kind): auth-service, rooms-service, drawings-service, messages-service, realtime-service, users-service, frontend
- Optional: Ingress controller (e.g. ingress-nginx) if using Ingress

## Two namespaces

- **whiteboard-backend** — auth, rooms, drawings, messages, realtime, users + backend Ingress (/api/*, /socket.io)
- **whiteboard-frontend** — frontend Deployment/Service + frontend Ingress (/)

Ingress can only route to services in its own namespace, so there are two Ingress resources. You get two entrypoints (e.g. two NodePorts or two hosts). Set **VITE_API_URL** to the backend base URL when building the frontend so the app can call the API.

## Install

```bash
# 1. Install the chart (creates both namespaces and all resources)
cd whiteboardK8s/backend
helm install backend ./chart --create-namespace -n whiteboard-backend

# 2. Create secret in backend namespace
kubectl create secret generic auth-secrets -n whiteboard-backend \
  --from-literal=MONGO_URI='mongodb+srv://...' \
  --from-literal=JWT_SECRET=your-secret

# 3. Build and load images; restart pods or wait for image pull
```

## Upgrade

```bash
helm upgrade backend ./chart -n whiteboard-backend
```

Override values (e.g. new image tag):

```bash
helm upgrade backend ./chart -n whiteboard-backend --set auth.tag=v2
```

## Uninstall

```bash
helm uninstall backend -n whiteboard-backend
kubectl delete namespace whiteboard-backend whiteboard-frontend
```

## Values

| Value | Default | Description |
|-------|---------|-------------|
| `backendNamespace` | whiteboard-backend | Namespace for backend services and backend Ingress |
| `frontendNamespace` | whiteboard-frontend | Namespace for frontend and frontend Ingress |
| `secretName` | auth-secrets | Secret (in backend namespace) with MONGO_URI, JWT_SECRET |
| `ingress.enabled` | true | Deploy Ingress (set false if no controller) |
| `auth.*`, `rooms.*`, `drawings.*`, `messages.*`, `realtime.*`, `users.*` | ... | Backend services |
| `frontend.enabled` | true | Deploy frontend and frontend Ingress |

Disable Ingress (e.g. no controller):

```bash
helm install backend ./chart -n whiteboard-backend --set ingress.enabled=false
```
