// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

/**
 * E2E: Mark a task as complete (status → Done) and verify strikethrough.
 */
test.describe('Complete a task', () => {
  test('marking a task as Done applies strikethrough to the title', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task to complete');
    await todoPage.changeStatus('Task to complete', 'Done');

    const title = page.getByText('Task to complete');
    await expect(title).toHaveCSS('text-decoration-line', 'line-through');
  });

  test('changing status back from Done removes the strikethrough', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Toggle complete task');
    await todoPage.changeStatus('Toggle complete task', 'Done');
    await todoPage.changeStatus('Toggle complete task', 'To Do');

    const title = page.getByText('Toggle complete task');
    await expect(title).not.toHaveCSS('text-decoration-line', 'line-through');
  });
});
