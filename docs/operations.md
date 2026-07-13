# Operations

[← Documentation home](../README.md)

## Health management

```mermaid
flowchart TD
    Pod --> Ready{Readiness /health}
    Ready -- Pass --> Traffic[Service sends traffic]
    Ready -- Fail --> Remove[Removed from endpoints]
    Pod --> Live{Liveness /health}
    Live -- Pass --> Continue
    Live -- Fail --> Restart[Container restarted]
```

All six backend Helm Deployments define readiness and liveness probes. The frontend Deployment currently has neither.

## Scaling model

```mermaid
flowchart LR
    Stateless[REST services] --> Replicas[Increase replicas in values.yaml]
    Realtime[Realtime service] --> One[1 replica works in memory]
    Realtime --> Many{More than 1?}
    Many -- Yes --> Redis[Set REDIS_URL + shared Redis]
```

The realtime code supports the Socket.IO Redis adapter, but the chart does not deploy Redis or inject `REDIS_URL`.

## Troubleshooting path

```mermaid
flowchart TD
    Fail[Application unavailable] --> Pods{Pods Ready?}
    Pods -- No --> Describe[kubectl describe pod]
    Describe --> Secret{Secret missing?}
    Describe --> Image{Image unavailable?}
    Pods -- Yes --> Routes{Ingress present?}
    Routes -- No --> Controller[Check ingress-nginx]
    Routes -- Yes --> Health[curl /health]
    Health --> Logs[kubectl logs]
```

Useful checks:

```bash
kubectl get all -n whiteboard-backend
kubectl get all -n whiteboard-frontend
kubectl get ingress -A
kubectl get events -A --sort-by=.lastTimestamp
```

## Persistence

```mermaid
flowchart LR
    Atlas[MongoDB Atlas] --> Durable[Managed persistence]
    Local[In-cluster MongoDB] --> Ephemeral[No PVC in current manifest]
    Ephemeral --> Loss[Data is lost when pod storage disappears]
```

Use Atlas or add a PersistentVolumeClaim before treating the in-cluster database as durable.
