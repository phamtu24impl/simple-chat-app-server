# simple-chat-app-server

### Setup

- Build

```bash
docker-compose build
docker-compose up -d
```

- Access the API at http://localhost:3000

### Authentication

- After signing in, following response will be return

```json
{
  "_id": "5f2e62d2f3fef80325ce63be",
  "username": "test",
  "__v": 0
}
```

Pass the header `Authorization: Bearer 5f2e62d2f3fef80325ce63be` to authenticate the user

### Socket events

- Pass the userId query parameters to socket when initialize (See `index.html` for example)

- After signing in, user will join the **allConversations** `userId/conversations` room. This room can receive following events:

  - `newLatestMessage`: when user's subscribed chat conversations has new message (in Home page)
  - `newConversation`: login user has been invited to new conversation

- Use `joinConversation`/`leaveConversation` to join/leave specific conversation. This room can receive the following events:
  - `newMessage`: when conversation has new message
