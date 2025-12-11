# Todo List Backend

A simple REST API for a to-do list application, built with Express and SQLite.

## Features

- RESTful API endpoints for CRUD operations
- SQLite database for persistent storage
- CORS enabled for frontend integration
- Lightweight and easy to deploy

## Project Structure

```
todo-backend/
├── server.js       # Express API server
├── todos.db        # SQLite database (auto-created)
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-backend.git
cd todo-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
```

The server will run at [http://localhost:3001](http://localhost:3001).

### Development mode (auto-restart on changes)

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PATCH | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |
| DELETE | `/api/todos` | Delete all completed todos |
| GET | `/api/health` | Health check |

## API Usage Examples

### Get all todos

```bash
curl http://localhost:3001/api/todos
```

Response:
```json
[
  {
    "id": 1,
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

### Create a todo

```bash
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Buy groceries"}'
```

Response:
```json
{
  "id": 1,
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### Update a todo (toggle completed)

```bash
curl -X PATCH http://localhost:3001/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a todo

```bash
curl -X DELETE http://localhost:3001/api/todos/1
```

### Clear all completed todos

```bash
curl -X DELETE http://localhost:3001/api/todos
```

## Configuration

### Port

Set the `PORT` environment variable to change the server port:

```bash
PORT=4000 npm start
```

### Database

The SQLite database file (`todos.db`) is automatically created in the project root when the server starts.

To reset the database, delete the `todos.db` file and restart the server.

## Database Schema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

For production deployment, consider:

1. **Process manager**: Use PM2 or similar
   ```bash
   npm install -g pm2
   pm2 start server.js --name todo-backend
   ```

2. **Environment variables**: Set `PORT` and any other config

3. **Reverse proxy**: Put behind Nginx or similar

4. **Database location**: Consider moving `todos.db` to a persistent volume

## Related

- [todo-frontend](https://github.com/your-username/todo-frontend) - The React frontend for this API

## Technologies Used

- Node.js
- Express
- better-sqlite3
- CORS
