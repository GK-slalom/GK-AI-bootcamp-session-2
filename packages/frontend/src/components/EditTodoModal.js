import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const PRIORITIES = [0, 1, 2, 3];

/**
 * EditTodoModal — modal dialog for editing an existing todo.
 *
 * @param {{ open: boolean, todo: object|null, statuses: Array, onSave: Function, onClose: Function }} props
 */
const EditTodoModal = ({ open, todo, statuses, onSave, onClose }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState(0);
  const [deadline, setDeadline] = useState(null);
  const [statusId, setStatusId] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Populate fields when todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setNotes(todo.notes || '');
      setPriority(todo.priority ?? 0);
      setDeadline(todo.deadline ? dayjs(todo.deadline) : null);
      setStatusId(todo.status_id ?? 1);
      setError('');
    }
  }, [todo]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError(t('todo.titleLabel') + ' is required');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await onSave(todo.id, {
        title: title.trim(),
        notes: notes || null,
        priority,
        deadline: deadline ? dayjs(deadline).format('YYYY-MM-DD') : null,
        status_id: statusId,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-todo-dialog-title"
    >
      <DialogTitle id="edit-todo-dialog-title">{t('todo.editTitle')}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label={t('todo.titleLabel')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            error={Boolean(error)}
            helperText={error}
            inputProps={{ 'aria-label': t('todo.titleLabel') }}
          />

          <TextField
            label={t('todo.notesLabel')}
            placeholder={t('todo.notesPlaceholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            inputProps={{ 'aria-label': t('todo.notesLabel') }}
          />

          <DatePicker
            label={t('todo.deadlineLabel')}
            value={deadline}
            onChange={setDeadline}
            slotProps={{ textField: { fullWidth: true, 'data-testid': 'modal-deadline-picker' } }}
          />

          <FormControl fullWidth>
            <InputLabel id="edit-priority-label">{t('todo.priorityLabel')}</InputLabel>
            <Select
              labelId="edit-priority-label"
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

          <FormControl fullWidth>
            <InputLabel id="edit-status-label">{t('todo.statusLabel')}</InputLabel>
            <Select
              labelId="edit-status-label"
              value={statusId}
              label={t('todo.statusLabel')}
              onChange={(e) => setStatusId(e.target.value)}
            >
              {statuses.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} aria-label={t('todo.cancel')}>
          {t('todo.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
          aria-label={t('todo.save')}
        >
          {t('todo.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodoModal;
