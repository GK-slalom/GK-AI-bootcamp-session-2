import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import { getDeadlineColour, formatDeadline } from '../utils/dateUtils';

const PRIORITY_LABELS = { 0: 'None', 1: 'Low', 2: 'Medium', 3: 'High' };
const PRIORITY_COLOURS = { 0: 'default', 1: 'info', 2: 'warning', 3: 'error' };

/**
 * TodoItem — a single row in the todo list.
 *
 * @param {{ todo: object, statuses: Array, onEdit: Function, onDelete: Function, onStatusChange: Function }} props
 */
const TodoItem = ({ todo, statuses, onEdit, onDelete, onStatusChange }) => {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);

  const isDone = todo.status === 'Done';
  const deadlineColour = getDeadlineColour(todo.deadline);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(todo.id);
    } catch {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (e) => {
    await onStatusChange(todo.id, { status_id: e.target.value });
  };

  return (
    <Card
      variant="outlined"
      sx={{ mb: 1.5 }}
      aria-label={`Task: ${todo.title}`}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', '&:last-child': { pb: 2 } }}>
        {/* Title + notes */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              textDecoration: isDone ? 'line-through' : 'none',
              color: deadlineColour ? `${deadlineColour}.main` : 'text.primary',
            }}
          >
            {todo.title}
          </Typography>

          {todo.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {todo.notes}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {todo.deadline && (
              <Chip
                label={formatDeadline(todo.deadline)}
                size="small"
                color={deadlineColour || 'default'}
                variant="outlined"
                aria-label={`Deadline: ${formatDeadline(todo.deadline)}`}
              />
            )}
            {todo.priority > 0 && (
              <Chip
                label={PRIORITY_LABELS[todo.priority]}
                size="small"
                color={PRIORITY_COLOURS[todo.priority]}
                variant="outlined"
                aria-label={`Priority: ${PRIORITY_LABELS[todo.priority]}`}
              />
            )}
          </Box>
        </Box>

        {/* Status selector */}
        <Select
          value={todo.status_id}
          onChange={handleStatusChange}
          size="small"
          sx={{ minWidth: 130 }}
          inputProps={{ 'aria-label': t('todo.statusLabel') }}
        >
          {statuses.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.label}
            </MenuItem>
          ))}
        </Select>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={t('todo.edit')}>
            <IconButton
              onClick={() => onEdit(todo)}
              size="small"
              aria-label={t('todo.edit')}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('todo.delete')}>
            <IconButton
              onClick={handleDelete}
              size="small"
              disabled={deleting}
              color="error"
              aria-label={t('todo.delete')}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
