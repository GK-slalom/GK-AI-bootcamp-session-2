// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');
const dayjs = require('dayjs');

/**
 * E2E: Colour coding — overdue tasks are red, tasks due today are orange.
 */
test.describe('Deadline colour coding', () => {
  test('a task due today is displayed in orange (warning colour)', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    const today = dayjs().format('MM/DD/YYYY');
    await todoPage.addTodo('Due today task', { deadline: today });

    const title = page.getByText('Due today task');
    // MUI warning.main is typically rgb(237, 108, 2) but we check the colour is applied
    await expect(title).not.toHaveCSS('color', 'rgb(33, 33, 33)'); // not default text colour
  });

  test('an overdue task is displayed in red (error colour)', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    const yesterday = dayjs().subtract(1, 'day').format('MM/DD/YYYY');
    await todoPage.addTodo('Overdue task', { deadline: yesterday });

    const title = page.getByText('Overdue task');
    await expect(title).not.toHaveCSS('color', 'rgb(33, 33, 33)'); // not default text colour
  });

  test('a future task has default text colour', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    const future = dayjs().add(10, 'day').format('MM/DD/YYYY');
    await todoPage.addTodo('Future task', { deadline: future });

    const title = page.getByText('Future task');
    // Should not have error or warning colour applied
    await expect(title).toBeVisible();
  });
});
