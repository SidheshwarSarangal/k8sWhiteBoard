# Service catalog

[← Documentation home](../README.md)

## Ownership map

```mermaid
flowchart LR
    Request{Request} --> A[Auth :3000]
    Request --> R[Rooms :3001]
    Request --> D[Drawings :3002]
    Request --> M[Messages :3003]
    Request --> L[Realtime :3004]
    Request --> U[Users :3005]

    A --> A1[Signup · login · JWT]
    R --> R1[Create · join · access]
    D --> D1[Save · load · delete strokes]
    M --> M1[Save · load chat]
    L --> L1[Broadcast live events]
    U --> U1[Profile · collaborations]
```

| Service | Ingress path | MongoDB | JWT check | Health |
|---|---|---:|---:|---|
| Auth | `/api/auth` | Yes | Issues JWT | `/health` |
| Rooms | `/api/rooms` | Yes | Private lookup only | `/health` |
| Drawings | `/api/drawings` | Yes | All routes | `/health` |
| Messages | `/api/messages` | Yes | All routes | `/health` |
| Realtime | `/socket.io` | No | No | `/health` |
| Users | `/api/users` | Yes | No | `/health` |

## REST surface

```mermaid
flowchart TD
    Auth --> Signup[POST /signup]
    Auth --> Login[POST /login]

    Rooms --> Create[POST /]
    Rooms --> Join[POST /join]
    Rooms --> Read[GET /:id]
    Rooms --> Owned[GET /getRoomsByOwner]
    Rooms --> Password[PUT /rooms/:roomId]

    Drawings --> Save[POST /]
    Drawings --> Load[GET /:roomId]
    Drawings --> Delete[DELETE /:id]
    Drawings --> Clear[DELETE /all/:roomId]

    Messages --> Send[POST /]
    Messages --> History[GET /:roomId]

    Users --> Add[POST /add-room-to-collabs]
    Users --> Collabs[GET /collabs/:username]
    Users --> Profile[GET /by-username/:username]
```

## Realtime events

| Client event | Broadcast result |
|---|---|
| `join_room` | Socket joins room; others receive `user_joined` |
| `drawing` | Others receive the new stroke |
| `drawing_deleted` | Others remove the stroke ID |
| `clear_canvas` | Everyone receives `canvas_cleared` |
| `send_message` | Everyone receives `receive_message` |
| disconnect | Room receives `user_left` |
