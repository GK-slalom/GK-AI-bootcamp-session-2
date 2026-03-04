/**
 * Integration tests for the Todos API.
 * Uses Jest + Supertest to verify the full HTTP request/response cycle.
 *
 * Directory: packages/backend/__tests__/integration/
 * Naming convention: *.test.js
 */
const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) db.close();
});

// ── Helper ────────────────────────────────────────────────────────────────────

const post = (data) =>
  request(app).post('/api/todos').send(data).set('Accept', 'application/json');

const patch = (id, data) =>
  request(app).patch(`/api/todos/${id}`).send(data).set('Accept', 'application/json');

// ── Full CRUD lifecycle ───────────────────────────────────────────────────────

describe('Todos API — full lifecycle', () => {
  let todoId;

  it('POST /api/todos — creates a new todo', async () => {
    const res = await post({ title: 'Integration task', deadline: '2026-12-01', priority: 2 });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Integration task');
    expect(res.body.deadline).toBe('2026-12-01');
    expect(res.body.priority).toBe(2);
    expect(res.body.status).toBe('To Do');
    todoId = res.body.id;
  });

  it('GET /api/todos — newly created todo appears in list', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    const found = res.body.find((t) => t.id === todoId);
    expect(found).toBeDefined();
    expect(found.title).toBe('Integration task');
  });

  it('PATCH /api/todos/:id — updates title and status in one request', async () => {
    const res = await patch(todoId, { title: 'Updated integration task', status_id: 2 });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated integration task');
    expect(res.body.status).toBe('In Progress');
    expect(res.body.status_id).toBe(2);
  });

  it('PATCH /api/todos/:id — marks as Done (completes the task)', async () => {
    const res = await patch(todoId, { status_id: 3 });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Done');
  });

  it('DELETE /api/todos/:id — removes the todo', async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(todoId);
  });

  it('GET /api/todos — deleted todo no longer appears', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    const found = res.body.find((t) => t.id === todoId);
    expect(found).toBeUndefined();
  });
});

// ── Filter by deadline ────────────────────────────────────────────────────────

describe('Todos API — filter by deadline', () => {
  beforeEach(async () => {
    await post({ title: 'No deadline task' });
    await post({ title: 'Has deadline task', deadline: '2026-06-01' });
  });

  it('GET /api/todos?filterByDeadline=true — tasks without deadline appear last', async () => {
    const res = await request(app).get('/api/todos?filterByDeadline=true');
    expect(res.status).toBe(200);
    const withDeadline = res.body.filter((t) => t.deadline);
    const withoutDeadline = res.body.filter((t) => !t.deadline);
    const lastWithDeadlineIndex = res.body.reduce(
      (acc, t, i) => (t.deadline ? i : acc),
      -1,
    );
    const firstWithoutDeadlineIndex = res.body.findIndex((t) => !t.deadline);
    if (withDeadline.length > 0 && withoutDeadline.length > 0) {
      expect(firstWithoutDeadlineIndex).toBeGreaterThan(lastWithDeadlineIndex);
    }
  });
});

// ── Validation edge cases ─────────────────────────────────────────────────────

describe('Todos API — validation', () => {
  it('POST — rejects missing title', async () => {
    const res = await post({});
    expect(res.status).toBe(400);
  });

  it('POST — rejects whitespace-only title', async () => {
    const res = await post({ title: '   ' });
    expect(res.status).toBe(400);
  });

  it('POST — rejects invalid status_id', async () => {
    const res = await post({ title: 'Bad', status_id: 99 });
    expect(res.status).toBe(400);
  });

  it('PATCH — returns 404 for unknown id', async () => {
    const res = await patch(999999, { title: 'Ghost' });
    expect(res.status).toBe(404);
  });

  it('DELETE — returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/todos/999999');
    expect(res.status).toBe(404);
  });
});

// ── Statuses endpoint ─────────────────────────────────────────────────────────

describe('GET /api/todos/statuses', () => {
  it('returns three statuses with correct labels', async () => {
    const res = await request(app).get('/api/todos/statuses');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body.map((s) => s.label)).toEqual(['To Do', 'In Progress', 'Done']);
  });
});
