# Frontend (Whiteboard React app)

Vite + React app; uses `VITE_API_URL` for API and Socket.IO base URL (empty = same origin).

## Run locally

```bash
npm install
# Optional: set API base (e.g. backend running elsewhere)
# echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev
```

## Build for production (same origin / Ingress)

Build with no `VITE_API_URL` so the app uses relative URLs; then the browser sends `/api/*` and `/socket.io` to the same host (the Ingress):

```bash
npm run build
```

## Docker

```bash
# Build (optional: --build-arg VITE_API_URL=http://your-ingress-url)
docker build -t frontend:latest .
```

## Deploy on Kubernetes (namespace whiteboard)

1. Build and load into kind: `docker build -t frontend:latest . && kind load docker-image frontend:latest --name whiteboard`
2. Apply: `kubectl apply -f k8s/deployment.yaml` and `kubectl apply -f k8s/service.yaml`
3. Ensure Ingress routes `/` to the frontend service so the app is served from the same host as `/api` and `/socket.io` (then no `VITE_API_URL` needed).

Or use the backend Helm chart with `frontend.enabled: true` to deploy backend + frontend and Ingress together.
