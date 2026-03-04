import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TodoItem from './TodoItem';

/**
 * TodoList — renders the list of todo items.
 *
 * @param {{ todos: Array, statuses: Array, onEdit: Function, onDelete: Function, onStatusChange: Function }} props
 */
const TodoList = ({ todos, statuses, onEdit, onDelete, onStatusChange }) => {
  const { t } = useTranslation();

  if (todos.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        {t('todo.noTasks')}
      </Typography>
    );
  }

  return (
    <Box role="list" aria-label="Todo list">
      {todos.map((todo) => (
        <Box key={todo.id} role="listitem">
          <TodoItem
            todo={todo}
            statuses={statuses}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </Box>
      ))}
    </Box>
  );
};

export default TodoList;
