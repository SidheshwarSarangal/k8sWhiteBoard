# Data and security

[← Documentation home](../README.md)

## Data ownership

```mermaid
erDiagram
    USER {
        ObjectId id PK
        string username UK
        string passwordHash
        array collabs
    }
    ROOM {
        string roomId UK
        string owner
        boolean isPrivate
        string password
        array allowedUsers
    }
    DRAWING {
        string roomId
        object strokeData
        string userId
    }
    MESSAGE {
        string roomId
        string sender
        string text
    }

    USER }o--o{ ROOM : collaborates
    ROOM ||--o{ DRAWING : contains
    ROOM ||--o{ MESSAGE : contains
```

## JWT path

```mermaid
sequenceDiagram
    actor User
    participant Auth
    participant UI
    participant Protected as Drawings / Messages

    User->>Auth: Login
    Auth-->>UI: Signed JWT
    UI->>Protected: Authorization: Bearer JWT
    Protected->>Protected: Verify with JWT_SECRET
    Protected-->>UI: Authorized response
```

## Secret distribution

```mermaid
flowchart LR
    Secret[auth-secrets]
    Secret -->|MONGO_URI + JWT_SECRET| Auth
    Secret -->|MONGO_URI + JWT_SECRET| Rooms
    Secret -->|MONGO_URI + JWT_SECRET| Drawings
    Secret -->|MONGO_URI + JWT_SECRET| Messages
    Secret -->|MONGO_URI| Users
    Realtime[Realtime] --> NoSecret[No Secret reference]
```

The Secret removes credentials from workload YAML, but Kubernetes Secrets are encoded rather than automatically encrypted at rest.

## Current trust boundaries

| Boundary | Current state |
|---|---|
| User passwords | Hashed with bcrypt in auth service |
| Room passwords | Stored as plain strings |
| Drawing/message REST | JWT required |
| Room/user REST | Mostly public |
| Socket.IO connection | No JWT authentication |
| NetworkPolicy | Not defined |
| TLS | Port 443 is mapped, but no TLS certificate/configuration is defined |
