import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockStatuses = [
  { id: 1, label: 'To Do' },
  { id: 2, label: 'In Progress' },
  { id: 3, label: 'Done' },
];

const mockTodos = [
  {
    id: 1,
    title: 'Test Task 1',
    notes: null,
    status_id: 1,
    status: 'To Do',
    priority: 0,
    deadline: null,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Test Task 2',
    notes: 'Some notes',
    status_id: 3,
    status: 'Done',
    priority: 2,
    deadline: '2026-03-04',
    created_at: '2026-01-02T00:00:00.000Z',
  },
];

// ── Mock server ───────────────────────────────────────────────────────────────

const server = setupServer(
  rest.get('/api/todos/statuses', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockStatuses)),
  ),

  rest.get('/api/todos', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockTodos)),
  ),

  rest.post('/api/todos', (req, res, ctx) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Todo title is required' }));
    }
    return res(
      ctx.status(201),
      ctx.json({
        id: 99,
        title,
        notes: null,
        status_id: 1,
        status: 'To Do',
        priority: 0,
        deadline: null,
        created_at: new Date().toISOString(),
      }),
    );
  }),

  rest.patch('/api/todos/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updates = req.body;
    const existing = mockTodos.find((t) => t.id === parseInt(id));
    if (!existing) return res(ctx.status(404), ctx.json({ error: 'Not found' }));
    return res(ctx.status(200), ctx.json({ ...existing, ...updates }));
  }),

  rest.delete('/api/todos/:id', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ message: 'Deleted', id: parseInt(req.params.id) })),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('App Component', () => {
  test('renders the app title', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('ToDo App')).toBeInTheDocument();
    });
  });

  test('renders the add task form', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });

  test('renders todo items from the API', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('task with status Done has strikethrough styling', async () => {
    render(<App />);
    await waitFor(() => {
      const doneTask = screen.getByText('Test Task 2');
      expect(doneTask).toHaveStyle('text-decoration: line-through');
    });
  });

  test('adds a new task when the form is submitted', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Add New Task'));

    const input = screen.getByLabelText('Task Title');
    await userEvent.type(input, 'Brand new task');
    await userEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(screen.getByText('Brand new task')).toBeInTheDocument();
    });
  });
});
      render(<App />);
    });
    expect(screen.getByText('React Frontend with Node Backend')).toBeInTheDocument();
    expect(screen.getByText('Connected to in-memory database')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText('Enter item name');
    await act(async () => {
      await user.type(input, 'New Test Item');
    });
    
    const submitButton = screen.getByText('Add Item');
    await act(async () => {
      await user.click(submitButton);
    });
    
    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });
});