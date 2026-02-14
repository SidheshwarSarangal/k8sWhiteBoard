# Backend (microservices)

**Helm** is the primary way to deploy and manage the backend (releases, upgrades, rollbacks, value overrides). **Kustomize** (`k8s/base` + `k8s/overlays`) is kept for reference and as an alternative.

## Structure

```
backend/
├── README.md
├── chart/                            # Helm chart (primary deploy)
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── README.md
│   └── templates/                    # Namespace, Ingress, 5× (Deployment + Service)
├── k8s/                              # Kustomize (alternative / reference)
│   ├── base/                         # Template-free YAML per component
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── ingress.yaml
│   │   ├── auth-service/
│   │   ├── rooms-service/
│   │   ├── drawings-service/
│   │   ├── messages-service/
│   │   └── realtime-service/
│   └── overlays/
│       └── default/
│           └── kustomization.yaml
├── auth-service/                     # App code + Dockerfile only
├── rooms-service/
├── drawings-service/
├── messages-service/
└── realtime-service/
```

## Deploy (Helm — recommended)

1. Create namespace and secret, build and load images (see **chart/README.md** for full steps).

2. Install the chart (creates **whiteboard-backend** and **whiteboard-frontend** namespaces):
   ```bash
   cd whiteboardK8s/backend
   helm install backend ./chart --create-namespace -n whiteboard-backend
   ```
   Create secret in backend namespace: `kubectl create secret generic auth-secrets -n whiteboard-backend ...`

3. Upgrade later:
   ```bash
   helm upgrade backend ./chart -n whiteboard-backend
   ```

See **chart/README.md** for install, upgrade, uninstall, and value overrides.

## Deploy (Kustomize — alternative)

Same prerequisites (secret, images). Then:

```bash
cd whiteboardK8s/backend
kubectl apply -k k8s/overlays/default
```

Preview: `kubectl kustomize k8s/overlays/default`  
Delete: `kubectl delete -k k8s/overlays/default`

## Optional: Ingress controller (Kind)

For path-based routing from outside the cluster:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

## Services

| Service          | Port | Path         |
|------------------|------|--------------|
| auth-service     | 3000 | /api/auth    |
| rooms-service    | 3001 | /api/rooms   |
| drawings-service | 3002 | /api/drawings|
| messages-service | 3003 | /api/messages|
| realtime-service | 3004 | /socket.io   |
