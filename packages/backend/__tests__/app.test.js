const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const createTodo = async (overrides = {}) => {
  const response = await request(app)
    .post('/api/todos')
    .send({ title: 'Test Task', ...overrides })
    .set('Accept', 'application/json');
  expect(response.status).toBe(201);
  return response.body;
};

// ── Health check ─────────────────────────────────────────────────────────────

describe('GET /', () => {
  it('should return a healthy status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

// ── Statuses ──────────────────────────────────────────────────────────────────

describe('GET /api/todos/statuses', () => {
  it('should return all task statuses', async () => {
    const response = await request(app).get('/api/todos/statuses');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body.map((s) => s.label)).toEqual(['To Do', 'In Progress', 'Done']);
  });
});

// ── GET /api/todos ────────────────────────────────────────────────────────────

describe('GET /api/todos', () => {
  it('should return an array of todos', async () => {
    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('each todo should include id, title, status, status_id', async () => {
    await createTodo({ title: 'Shape check task' });
    const response = await request(app).get('/api/todos');
    const todo = response.body.find((t) => t.title === 'Shape check task');
    expect(todo).toBeDefined();
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('title');
    expect(todo).toHaveProperty('status');
    expect(todo).toHaveProperty('status_id');
    expect(todo).toHaveProperty('created_at');
  });

  it('should accept sort query param', async () => {
    const response = await request(app).get('/api/todos?sort=priority');
    expect(response.status).toBe(200);
  });

  it('should accept filterByDeadline query param', async () => {
    const response = await request(app).get('/api/todos?filterByDeadline=true');
    expect(response.status).toBe(200);
  });
});

// ── POST /api/todos ───────────────────────────────────────────────────────────

describe('POST /api/todos', () => {
  it('should create a todo with a title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'New task' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('New task');
    expect(response.body.status).toBe('To Do');
    expect(response.body.status_id).toBe(1);
  });

  it('should create a todo with an optional deadline', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Deadline task', deadline: '2026-12-31' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.deadline).toBe('2026-12-31');
  });

  it('should reject a todo with an empty title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: '   ' })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject a todo with no title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
  });

  it('should reject an invalid status_id', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Bad status', status_id: 999 })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
  });
});

// ── PATCH /api/todos/:id ──────────────────────────────────────────────────────

describe('PATCH /api/todos/:id', () => {
  it('should update the title of a todo', async () => {
    const todo = await createTodo({ title: 'Original title' });
    const response = await request(app)
      .patch(`/api/todos/${todo.id}`)
      .send({ title: 'Updated title' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated title');
  });

  it('should update notes of a todo', async () => {
    const todo = await createTodo();
    const response = await request(app)
      .patch(`/api/todos/${todo.id}`)
      .send({ notes: 'Some notes' });

    expect(response.status).toBe(200);
    expect(response.body.notes).toBe('Some notes');
  });

  it('should update the deadline of a todo', async () => {
    const todo = await createTodo();
    const response = await request(app)
      .patch(`/api/todos/${todo.id}`)
      .send({ deadline: '2026-06-15' });

    expect(response.status).toBe(200);
    expect(response.body.deadline).toBe('2026-06-15');
  });

  it('should update the status_id of a todo', async () => {
    const todo = await createTodo();
    const response = await request(app)
      .patch(`/api/todos/${todo.id}`)
      .send({ status_id: 2 });

    expect(response.status).toBe(200);
    expect(response.body.status_id).toBe(2);
    expect(response.body.status).toBe('In Progress');
  });

  it('should update multiple fields at once', async () => {
    const todo = await createTodo();
    const response = await request(app)
      .patch(`/api/todos/${todo.id}`)
      .send({ title: 'Multi update', priority: 3, status_id: 3 });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Multi update');
    expect(response.body.priority).toBe(3);
    expect(response.body.status).toBe('Done');
  });

  it('should return 404 for a non-existent todo', async () => {
    const response = await request(app).patch('/api/todos/999999').send({ title: 'x' });
    expect(response.status).toBe(404);
  });

  it('should return 400 for an invalid status_id', async () => {
    const todo = await createTodo();
    const response = await request(app)
      .patch(`/api/todos/${todo.id}`)
      .send({ status_id: 999 });
    expect(response.status).toBe(400);
  });
});

// ── DELETE /api/todos/:id ─────────────────────────────────────────────────────

describe('DELETE /api/todos/:id', () => {
  it('should delete an existing todo', async () => {
    const todo = await createTodo({ title: 'To be deleted' });
    const response = await request(app).delete(`/api/todos/${todo.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(todo.id);
  });

  it('should return 404 when deleting a non-existent todo', async () => {
    const response = await request(app).delete('/api/todos/999999');
    expect(response.status).toBe(404);
  });

  it('should return 400 for an invalid id', async () => {
    const response = await request(app).delete('/api/todos/abc');
    expect(response.status).toBe(400);
  });
});