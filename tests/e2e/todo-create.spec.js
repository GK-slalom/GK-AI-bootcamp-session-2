// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

/**
 * E2E: Create a task — happy path and with an optional deadline.
 */
test.describe('Create a task', () => {
  test('user can create a new task without a deadline', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('My first task');
    await todoPage.expectTodoVisible('My first task');
  });

  test('user can create a task with a deadline', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task with deadline', { deadline: '12/31/2026' });
    await todoPage.expectTodoVisible('Task with deadline');
  });

  test('form clears after successful submission', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Cleared task');
    await expect(todoPage.titleInput).toHaveValue('');
  });
});
