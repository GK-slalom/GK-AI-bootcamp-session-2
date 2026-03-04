const BASE = '/api/todos';

/**
 * Fetch all todos.
 * @param {{ sort?: string, filterByDeadline?: boolean }} params
 * @returns {Promise<Array>}
 */
export const fetchTodos = async ({ sort, filterByDeadline } = {}) => {
  const params = new URLSearchParams();
  if (sort) params.set('sort', sort);
  if (filterByDeadline) params.set('filterByDeadline', 'true');
  const query = params.toString();
  const response = await fetch(`${BASE}${query ? `?${query}` : ''}`);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

/**
 * Fetch all allowed task statuses.
 * @returns {Promise<Array<{ id: number, label: string }>>}
 */
export const fetchStatuses = async () => {
  const response = await fetch(`${BASE}/statuses`);
  if (!response.ok) throw new Error('Failed to fetch statuses');
  return response.json();
};

/**
 * Create a new todo.
 * @param {{ title: string, deadline?: string, notes?: string, priority?: number, status_id?: number }} data
 * @returns {Promise<object>}
 */
export const createTodo = async (data) => {
  const response = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
};

/**
 * Partially update a todo.
 * @param {number} id
 * @param {{ title?: string, notes?: string, priority?: number, deadline?: string, status_id?: number }} data
 * @returns {Promise<object>}
 */
export const updateTodo = async (id, data) => {
  const response = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

/**
 * Delete a todo by id.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteTodo = async (id) => {
  const response = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete todo');
};
