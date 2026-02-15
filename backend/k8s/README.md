# k8s (base + overlays)

**Base:** Shared resources for backend — namespace, Ingress, and per-service Deployment/Service (auth, rooms, drawings, messages, realtime). Kustomize base does **not** include users-service or frontend; Helm chart is the full deploy.

**Overlay `overlays/default`:** Sets namespace `whiteboard-backend`; apply with `kubectl apply -k k8s/overlays/default`.

**Optional — in-cluster MongoDB:** `mongodb.yaml` deploys a single MongoDB pod + Service in `whiteboard-backend`. Use with `auth-secrets` set to `MONGO_URI=mongodb://mongodb:27017/whiteboard` so all backend services use it (no Atlas). Data is ephemeral unless you add a PVC.
