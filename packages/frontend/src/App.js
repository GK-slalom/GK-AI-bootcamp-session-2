import React, { useState } from 'react';
import {
  Alert,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTranslation } from 'react-i18next';

import './i18n';
import useTodos from './hooks/useTodos';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import FilterSortBar from './components/FilterSortBar';
import EditTodoModal from './components/EditTodoModal';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});

function App() {
  const { t } = useTranslation();
  const {
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
  } = useTodos();

  const [editingTodo, setEditingTodo] = useState(null);

  const handleEdit = (todo) => setEditingTodo(todo);
  const handleCloseEdit = () => setEditingTodo(null);

  const handleSave = async (id, data) => {
    await editTodo(id, data);
  };

  const handleStatusChange = async (id, data) => {
    await editTodo(id, data);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              {t('app.title')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t('app.subtitle')}
            </Typography>
          </Box>

          {/* Add task form */}
          <AddTodoForm statuses={statuses} onAdd={addTodo} />

          {/* Sort / filter controls */}
          <FilterSortBar
            sort={sort}
            setSort={setSort}
            filterByDeadline={filterByDeadline}
            setFilterByDeadline={setFilterByDeadline}
          />

          <Divider sx={{ mb: 2 }} />

          {/* State feedback */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress aria-label={t('status.loading')} />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Todo list */}
          {!loading && !error && (
            <TodoList
              todos={todos}
              statuses={statuses}
              onEdit={handleEdit}
              onDelete={removeTodo}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Edit modal */}
          <EditTodoModal
            open={Boolean(editingTodo)}
            todo={editingTodo}
            statuses={statuses}
            onSave={handleSave}
            onClose={handleCloseEdit}
          />
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;