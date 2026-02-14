# Auth Service

Whiteboard auth microservice: signup, login, JWT.

## Run locally (no Docker/K8s)

1. Copy `.env.example` to `.env`, set `MONGO_URI` and `JWT_SECRET`.
2. MongoDB must be running (local or remote).
3. `npm install && npm start` — listens on port 3000.

## Build image and run on kind

1. Create kind cluster (if not done):  
   `kind create cluster --name whiteboard`

2. Create namespace (once for entire backend) and secret. From `whiteboardK8s/backend/`:
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl create secret generic auth-secrets -n whiteboard \
     --from-literal=MONGO_URI='mongodb+srv://<user>:<password>@cluster0.onuyxhs.mongodb.net/whiteboard' \
     --from-literal=JWT_SECRET=<your-jwt-secret>
   ```
   Use your Atlas URI (include DB name, e.g. `/whiteboard` at the end). Keep credentials out of Git.

3. Build and load image into kind:
   ```bash
   docker build -t auth-service:latest .
   kind load docker-image auth-service:latest --name whiteboard
   ```

4. Deploy:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

5. Test:
   ```bash
   kubectl port-forward svc/auth-service 3000:3000 -n whiteboard
   curl http://localhost:3000/health
   curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
   ```

## Endpoints

- `GET /health` — health check
- `POST /api/auth/signup` — body: `{ "username", "password" }`
- `POST /api/auth/login` — body: `{ "username", "password" }`
