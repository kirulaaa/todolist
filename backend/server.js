const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'todos.db');
const db = new Database(dbPath);

// Create todos table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log(`Database initialized at ${dbPath}`);

// ============ API Routes ============

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
    const formattedTodos = todos.map(todo => ({
      id: todo.id,
      text: todo.text,
      completed: Boolean(todo.completed),
      createdAt: todo.created_at
    }));
    res.json(formattedTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - Create a new todo
app.post('/api/todos', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
    const result = stmt.run(text.trim());
    
    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      id: newTodo.id,
      text: newTodo.text,
      completed: Boolean(newTodo.completed),
      createdAt: newTodo.created_at
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PATCH /api/todos/:id - Update a todo (toggle completed)
app.patch('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { completed, text } = req.body;

    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (completed !== undefined) {
      db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
    }
    
    if (text !== undefined) {
      db.prepare('UPDATE todos SET text = ? WHERE id = ?').run(text.trim(), id);
    }

    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    res.json({
      id: updated.id,
      text: updated.text,
      completed: Boolean(updated.completed),
      createdAt: updated.created_at
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a single todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// DELETE /api/todos - Delete all completed todos
app.delete('/api/todos', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM todos WHERE completed = 1').run();
    res.json({ 
      message: 'Completed todos deleted successfully',
      deleted: result.changes 
    });
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    res.status(500).json({ error: 'Failed to clear completed todos' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET    /api/todos      - Get all todos`);
  console.log(`  POST   /api/todos      - Create a todo`);
  console.log(`  PATCH  /api/todos/:id  - Update a todo`);
  console.log(`  DELETE /api/todos/:id  - Delete a todo`);
  console.log(`  DELETE /api/todos      - Delete all completed`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  db.close();
  process.exit(0);
});
