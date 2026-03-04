import dayjs from 'dayjs';

/**
 * Returns a highlight colour based on the todo's deadline relative to today.
 * - 'error'   (#red)   — past due
 * - 'warning' (#orange) — due today
 * - undefined          — no colouring required
 *
 * @param {string|null|undefined} deadline - ISO date string (YYYY-MM-DD)
 * @returns {'error' | 'warning' | undefined}
 */
export const getDeadlineColour = (deadline) => {
  if (!deadline) return undefined;

  const today = dayjs().startOf('day');
  const due = dayjs(deadline).startOf('day');

  if (due.isBefore(today)) return 'error';
  if (due.isSame(today)) return 'warning';
  return undefined;
};

/**
 * Format a deadline string for display.
 * @param {string|null|undefined} deadline
 * @returns {string}
 */
export const formatDeadline = (deadline) => {
  if (!deadline) return '';
  return dayjs(deadline).format('D MMM YYYY');
};
