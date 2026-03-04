const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables and seed data
db.exec(`
  CREATE TABLE IF NOT EXISTS task_status (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL UNIQUE
  );

  INSERT INTO task_status (label) VALUES ('To Do'), ('In Progress'), ('Done');

  CREATE TABLE IF NOT EXISTS todos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    notes      TEXT,
    status_id  INTEGER NOT NULL DEFAULT 1,
    priority   INTEGER DEFAULT 0,
    deadline   TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (status_id) REFERENCES task_status(id)
  );
`);

console.log('In-memory database initialized');

// Helper: fetch a single todo with its status label
const getTodoById = (id) => db.prepare(`
  SELECT t.*, s.label AS status
  FROM todos t
  JOIN task_status s ON t.status_id = s.id
  WHERE t.id = ?
`).get(id);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// ── Statuses ──────────────────────────────────────────────────────────────────

// GET /api/todos/statuses — list all allowed statuses
app.get('/api/todos/statuses', (req, res) => {
  try {
    const statuses = db.prepare('SELECT * FROM task_status ORDER BY id').all();
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ error: 'Failed to fetch statuses' });
  }
});

// ── Todos ─────────────────────────────────────────────────────────────────────

// GET /api/todos — list all todos, optional ?filterByDeadline=true&sort=deadline|priority|created_at
app.get('/api/todos', (req, res) => {
  try {
    const { sort, filterByDeadline } = req.query;
    const allowedSorts = ['deadline', 'priority', 'created_at'];
    const sortColumn = allowedSorts.includes(sort) ? `t.${sort}` : 't.created_at';

    let orderClause;
    if (filterByDeadline === 'true') {
      // Todos with no deadline go to the bottom; within each group sort by deadline asc
      orderClause = `CASE WHEN t.deadline IS NULL THEN 1 ELSE 0 END, t.deadline ASC`;
    } else {
      orderClause = `${sortColumn} DESC`;
    }

    const todos = db.prepare(`
      SELECT t.*, s.label AS status
      FROM todos t
      JOIN task_status s ON t.status_id = s.id
      ORDER BY ${orderClause}
    `).all();

    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos — create a new todo
app.post('/api/todos', (req, res) => {
  try {
    const { title, notes, deadline, priority, status_id } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Todo title is required' });
    }

    if (status_id !== undefined) {
      const validStatus = db.prepare('SELECT id FROM task_status WHERE id = ?').get(status_id);
      if (!validStatus) {
        return res.status(400).json({ error: 'Invalid status_id' });
      }
    }

    const result = db.prepare(`
      INSERT INTO todos (title, notes, deadline, priority, status_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      title.trim(),
      notes || null,
      deadline || null,
      priority ?? 0,
      status_id ?? 1,
    );

    const newTodo = getTodoById(result.lastInsertRowid);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PATCH /api/todos/:id — partial update (title, notes, priority, deadline, status_id)
app.patch('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existing = getTodoById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const { title, notes, priority, deadline, status_id } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }

    if (status_id !== undefined) {
      const validStatus = db.prepare('SELECT id FROM task_status WHERE id = ?').get(status_id);
      if (!validStatus) {
        return res.status(400).json({ error: 'Invalid status_id' });
      }
    }

    db.prepare(`
      UPDATE todos SET
        title      = COALESCE(?, title),
        notes      = CASE WHEN ? IS NOT NULL THEN ? ELSE notes END,
        priority   = COALESCE(?, priority),
        deadline   = CASE WHEN ? IS NOT NULL THEN ? ELSE deadline END,
        status_id  = COALESCE(?, status_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title ? title.trim() : null,
      notes !== undefined ? notes : null,
      notes !== undefined ? notes : null,
      priority !== undefined ? priority : null,
      deadline !== undefined ? deadline : null,
      deadline !== undefined ? deadline : null,
      status_id !== undefined ? status_id : null,
      id,
    );

    const updated = getTodoById(id);
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id — remove a todo
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid todo ID is required' });
    }

    const existingItem = getTodoById(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);

    if (result.changes > 0) {
      res.json({ message: 'Todo deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = { app, db };