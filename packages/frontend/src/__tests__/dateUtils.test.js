import dayjs from 'dayjs';
import { getDeadlineColour, formatDeadline } from '../utils/dateUtils';

describe('getDeadlineColour', () => {
  test('returns undefined when deadline is null', () => {
    expect(getDeadlineColour(null)).toBeUndefined();
  });

  test('returns undefined when deadline is undefined', () => {
    expect(getDeadlineColour(undefined)).toBeUndefined();
  });

  test('returns "error" for a past deadline', () => {
    const pastDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    expect(getDeadlineColour(pastDate)).toBe('error');
  });

  test('returns "warning" for today\'s deadline', () => {
    const today = dayjs().format('YYYY-MM-DD');
    expect(getDeadlineColour(today)).toBe('warning');
  });

  test('returns undefined for a future deadline', () => {
    const futureDate = dayjs().add(5, 'day').format('YYYY-MM-DD');
    expect(getDeadlineColour(futureDate)).toBeUndefined();
  });
});

describe('formatDeadline', () => {
  test('returns empty string for null', () => {
    expect(formatDeadline(null)).toBe('');
  });

  test('returns empty string for undefined', () => {
    expect(formatDeadline(undefined)).toBe('');
  });

  test('formats a date correctly', () => {
    expect(formatDeadline('2026-03-04')).toBe('4 Mar 2026');
  });
});
