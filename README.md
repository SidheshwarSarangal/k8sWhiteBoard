# WhiteboardK8s

Real-time collaborative whiteboard (React + Node + Socket.IO) run as microservices on Kubernetes. Two namespaces: **whiteboard-backend** (six API services + optional in-cluster MongoDB) and **whiteboard-frontend** (SPA). Single entrypoint via **NGINX Ingress** (path-based routing).

---

## Overview

- **Frontend:** React SPA served at `/`; calls `/api/*` and connects to `/socket.io` for real-time drawing and chat.
- **Backend:** auth (3000), rooms (3001), drawings (3002), messages (3003), realtime/Socket.IO (3004), users (3005). All except realtime use MongoDB; realtime is Socket.IO only (optional Redis for multi-replica).
- **Ingress:** NGINX Ingress Controller routes `/` → frontend, `/api/auth`, `/api/rooms`, `/api/drawings`, `/api/messages`, `/api/users`, `/socket.io`, `/health` → backend services in `whiteboard-backend`.
- **Data:** `auth-secrets` holds `MONGO_URI` and `JWT_SECRET`. Use Atlas or in-cluster MongoDB (see `backend/k8s/mongodb.yaml` and `backend/k8s/README.md`).

---

## Connections

| From            | To                | How |
|-----------------|-------------------|-----|
| Browser         | App + API + Socket| `http://localhost` (Ingress: `/` → frontend, `/api/*`, `/socket.io`, `/health` → backend) |
| Ingress         | Backend / Frontend| Path-based rules; backend Ingress in `whiteboard-backend`, frontend Ingress in `whiteboard-frontend` |
| Backend pods    | MongoDB           | `MONGO_URI` from secret `auth-secrets` (e.g. `mongodb://mongodb:27017/whiteboard` in-cluster) |
| Backend pods    | JWT validation    | `JWT_SECRET` from `auth-secrets` |
| Frontend pod    | Backend           | Same origin when served behind same Ingress host (no extra env) |

---

## Technologies

- **Orchestration:** Kubernetes (Kind), Helm  
- **Ingress:** NGINX Ingress Controller (deploy for Kind: `ingress-nginx`)  
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, optional Redis  
- **Frontend:** React, Vite; built and served by nginx in container  
- **Images:** Docker; built locally and loaded into Kind  

---

## Components (Helm chart)

- **Namespaces:** `whiteboard-backend`, `whiteboard-frontend`  
- **Deployments:** auth-service, rooms-service, drawings-service, messages-service, realtime-service, users-service (all in backend); frontend (in frontend). Optional: MongoDB Deployment in backend (see `backend/k8s/`).  
- **Services:** One ClusterIP Service per Deployment.  
- **Ingress:** `whiteboard-backend` (backend paths), `whiteboard-frontend` (path `/`).  
- **Secret:** `auth-secrets` in `whiteboard-backend` (MONGO_URI, JWT_SECRET).  

---

## Commands (run from repo root; Kind + in-cluster MongoDB)

**1. Create Kind cluster (port 80/443 exposed)**  
```bash
kind create cluster --name whiteboard --config kind-config.yaml
```

**2. Create backend namespace with Helm labels (so Helm can adopt it)**  
```bash
kubectl create namespace whiteboard-backend
kubectl label namespace whiteboard-backend app.kubernetes.io/managed-by=Helm
kubectl annotate namespace whiteboard-backend meta.helm.sh/release-name=whiteboard meta.helm.sh/release-namespace=whiteboard-backend
```

**3. Deploy in-cluster MongoDB (optional; skip if using Atlas)**  
```bash
kubectl apply -f backend/k8s/mongodb.yaml
kubectl wait -n whiteboard-backend --for=condition=ready pod -l app=mongodb --timeout=120s
```

**4. Create secret (in-cluster MongoDB example; replace if using Atlas)**  
```bash
kubectl create secret generic auth-secrets -n whiteboard-backend \
  --from-literal=MONGO_URI='mongodb://mongodb:27017/whiteboard' \
  --from-literal=JWT_SECRET='YOUR_JWT_SECRET_MIN_32_CHARS'
```

**5. Build and load images**  
```bash
docker build -t auth-service:latest backend/auth-service
docker build -t rooms-service:latest backend/rooms-service
docker build -t drawings-service:latest backend/drawings-service
docker build -t messages-service:latest backend/messages-service
docker build -t realtime-service:latest backend/realtime-service
docker build -t users-service:latest backend/users-service
docker build -t frontend:latest frontend

kind load docker-image auth-service:latest rooms-service:latest drawings-service:latest messages-service:latest realtime-service:latest users-service:latest frontend:latest --name whiteboard
```

**6. Install Helm chart**  
```bash
cd backend && helm install whiteboard ./chart -n whiteboard-backend
```

**7. Install NGINX Ingress Controller (Kind)**  
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s
```

**8. Verify**  
```bash
kubectl get pods -n whiteboard-backend
kubectl get pods -n whiteboard-frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost/health   # expect 200
```  
Open **http://localhost** in the browser.

---

## Using Atlas instead of in-cluster MongoDB

- Skip step 3. In step 4, set `MONGO_URI` to your Atlas URI (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/whiteboard`).  
- In Atlas: **Network Access** → add **0.0.0.0/0** (or your IP); ensure cluster is not paused.

---

## Teardown

```bash
helm uninstall whiteboard -n whiteboard-backend
kubectl delete namespace whiteboard-backend --ignore-not-found
kubectl delete namespace whiteboard-frontend --ignore-not-found
kind delete cluster --name whiteboard
```

---

## Detailed study of this project steps and methods

[Study](https://github.com/SidheshwarSarangal/study-of-k8s-method-project-of-white-board.git)

---
