import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Switch,
  Toolbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * FilterSortBar — controls to sort and filter the todo list.
 *
 * @param {{ sort: string, setSort: Function, filterByDeadline: boolean, setFilterByDeadline: Function }} props
 */
const FilterSortBar = ({ sort, setSort, filterByDeadline, setFilterByDeadline }) => {
  const { t } = useTranslation();

  return (
    <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap', mb: 1 }}>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="sort-label">{t('filter.sortBy')}</InputLabel>
        <Select
          labelId="sort-label"
          value={sort}
          label={t('filter.sortBy')}
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value="created_at">{t('filter.sortCreated')}</MenuItem>
          <MenuItem value="deadline">{t('filter.sortDeadline')}</MenuItem>
          <MenuItem value="priority">{t('filter.sortPriority')}</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        data-testid="filter-deadline-toggle"
        control={
          <Switch
            checked={filterByDeadline}
            onChange={(e) => setFilterByDeadline(e.target.checked)}
            color="primary"
            inputProps={{ 'aria-label': t('filter.filterDeadline') }}
          />
        }
        label={t('filter.filterDeadline')}
      />
    </Toolbar>
  );
};

export default FilterSortBar;
