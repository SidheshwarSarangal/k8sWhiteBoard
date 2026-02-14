# Auth Service

Whiteboard auth microservice: signup, login, JWT.

## Run locally (no Docker/K8s)

1. Copy `.env.example` to `.env`, set `MONGO_URI` and `JWT_SECRET`.
2. MongoDB must be running (local or remote).
3. `npm install && npm start` — listens on port 3000.

## Build image and run on kind

1. Create kind cluster (if not done):  
   `kind create cluster --name whiteboard`

2. Create backend namespace and secret (or use Helm, which creates namespaces):
   ```bash
   kubectl create namespace whiteboard-backend
   kubectl create secret generic auth-secrets -n whiteboard-backend \
     --from-literal=MONGO_URI='mongodb+srv://<user>:<password>@cluster0.onuyxhs.mongodb.net/whiteboard' \
     --from-literal=JWT_SECRET=<your-jwt-secret>
   ```
   Use your Atlas URI (include DB name, e.g. `/whiteboard` at the end). Keep credentials out of Git.

3. Build and load image into kind:
   ```bash
   docker build -t auth-service:latest .
   kind load docker-image auth-service:latest --name whiteboard
   ```

4. Deploy (ensure deployment/service YAML use namespace whiteboard-backend, or apply with -n whiteboard-backend):
   ```bash
   kubectl apply -f k8s/deployment.yaml -n whiteboard-backend
   kubectl apply -f k8s/service.yaml -n whiteboard-backend
   ```

5. Test:
   ```bash
   kubectl port-forward svc/auth-service 3000:3000 -n whiteboard-backend
   curl http://localhost:3000/health
   curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
   ```

## Endpoints

- `GET /health` — health check
- `POST /api/auth/signup` — body: `{ "username", "password" }`
- `POST /api/auth/login` — body: `{ "username", "password" }`
