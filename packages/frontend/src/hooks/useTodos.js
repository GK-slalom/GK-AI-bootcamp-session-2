import { useState, useEffect, useCallback } from 'react';
import {
  fetchTodos,
  fetchStatuses,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../api/todos';

/**
 * Custom hook encapsulating all todo state and operations.
 */
const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('created_at');
  const [filterByDeadline, setFilterByDeadline] = useState(false);

  const loadStatuses = useCallback(async () => {
    try {
      const data = await fetchStatuses();
      setStatuses(data);
    } catch (err) {
      console.error('Failed to load statuses:', err);
    }
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTodos({ sort, filterByDeadline });
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sort, filterByDeadline]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(async (data) => {
    const newTodo = await createTodo(data);
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const editTodo = useCallback(async (id, data) => {
    const updated = await updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  }, []);

  const removeTodo = useCallback(async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    todos,
    statuses,
    loading,
    error,
    sort,
    setSort,
    filterByDeadline,
    setFilterByDeadline,
    addTodo,
    editTodo,
    removeTodo,
    reload: loadTodos,
  };
};

export default useTodos;
