const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
// RDS requires SSL; local postgres does not — controlled via PGSSLMODE=disable
const pool = new Pool({
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
});

// Initialize todos table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id         SERIAL      PRIMARY KEY,
      text       TEXT        NOT NULL,
      completed  BOOLEAN     NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log('Database initialized');
}

// ============ API Routes ============
app.get('/', (req, res) => {
  res.send('Hi there!');
});

// GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows.map(r => ({ id: r.id, text: r.text, completed: r.completed, createdAt: r.created_at })));
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Todo text is required' });
    }
    const { rows } = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING *',
      [text.trim()]
    );
    const r = rows[0];
    res.status(201).json({ id: r.id, text: r.text, completed: r.completed, createdAt: r.created_at });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PATCH /api/todos/:id - Update a todo (toggle completed or edit text)
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, text } = req.body;

    const existing = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (completed !== undefined) {
      await pool.query('UPDATE todos SET completed = $1 WHERE id = $2', [completed, id]);
    }
    if (text !== undefined) {
      await pool.query('UPDATE todos SET text = $1 WHERE id = $2', [text.trim(), id]);
    }

    const { rows } = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    const r = rows[0];
    res.json({ id: r.id, text: r.text, completed: r.completed, createdAt: r.created_at });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a single todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// DELETE /api/todos - Delete all completed todos
app.delete('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM todos WHERE completed = TRUE');
    res.json({ message: 'Completed todos deleted successfully', deleted: result.rowCount });
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
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('API endpoints:');
      console.log('  GET    /api/todos      - Get all todos');
      console.log('  POST   /api/todos      - Create a todo');
      console.log('  PATCH  /api/todos/:id  - Update a todo');
      console.log('  DELETE /api/todos/:id  - Delete a todo');
      console.log('  DELETE /api/todos      - Delete all completed');
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await pool.end();
  process.exit(0);
});
