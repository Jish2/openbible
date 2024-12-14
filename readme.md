# Open Bible

A collaborative and engaging bible study experience

## Backend

### Running

`cd backend` && `go run .`

### Deployment

Dockerfile to be created

### Websocket Schema

#### Push

`GET wss://` Subscribe to websocket

`ws.send`

```json
{
  "Action": ("comment" | "highlight" | "select" | "scroll"),
  "VerseID": 0,
  "Message": "message"
}
```

#### Pull

`Subscribe Response`

```json
{
  "Action": "subscribe",
  "Msg": "user-id",
  "Body": "ALL EVENT HISTORY"
}
```

`Scroll Positions (Ticks Every 200ms)`

```json
{
    "Action":"positions",
    "Body"
        [
            {
            "UserID":"7dfae4f5-4c8d-4926-93d5-1d295b25f717",
            "VerseID":30
            }
        ]
}
```

`Event`

In the case of "join" event, the user's name will be in the `Message` field

```json
{
  "UUID": "7dfae4f5-4c8d-4926-93d5-1d295b25f717",
  "Action":  ("join" | "leave" | "comment" | "highlight" | "select" | "scroll"),
  "VerseID": 0,
  "Message": "test"
}
```
