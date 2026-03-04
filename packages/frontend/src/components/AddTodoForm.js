import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Paper,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const PRIORITIES = [0, 1, 2, 3];

/**
 * AddTodoForm — form for creating a new todo task.
 *
 * @param {{ statuses: Array, onAdd: Function }} props
 */
const AddTodoForm = ({ statuses, onAdd }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [priority, setPriority] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('todo.titleLabel') + ' is required');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await onAdd({
        title: title.trim(),
        deadline: deadline ? dayjs(deadline).format('YYYY-MM-DD') : null,
        priority,
      });
      setTitle('');
      setDeadline(null);
      setPriority(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('todo.addTitle')}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}
        noValidate
      >
        <TextField
          label={t('todo.titleLabel')}
          placeholder={t('todo.titlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          required
          error={Boolean(error)}
          helperText={error}
          sx={{ flexGrow: 1, minWidth: 220 }}
          inputProps={{ 'aria-label': t('todo.titleLabel') }}
        />

        <DatePicker
          label={t('todo.deadlineLabel')}
          value={deadline}
          onChange={setDeadline}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 180 }, 'data-testid': 'add-deadline-picker' } }}
        />

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="add-priority-label">{t('todo.priorityLabel')}</InputLabel>
          <Select
            labelId="add-priority-label"
            value={priority}
            label={t('todo.priorityLabel')}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {t(`todo.priority.${p}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          aria-label={t('todo.add')}
        >
          {t('todo.add')}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddTodoForm;
