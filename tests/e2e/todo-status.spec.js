// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

/**
 * E2E: Change task status through all three states.
 */
test.describe('Task status changes', () => {
  test('user can cycle through all statuses: To Do → In Progress → Done', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Status cycle task');

    // Default is 'To Do'
    const card = todoPage.getTodoCard('Status cycle task');
    await expect(card).toBeVisible();

    await todoPage.changeStatus('Status cycle task', 'In Progress');
    // Card should still be visible and not have strikethrough
    const title = page.getByText('Status cycle task');
    await expect(title).not.toHaveCSS('text-decoration-line', 'line-through');

    await todoPage.changeStatus('Status cycle task', 'Done');
    await expect(title).toHaveCSS('text-decoration-line', 'line-through');
  });

  test('user can change status via edit modal', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Modal status task');
    await todoPage.clickEdit('Modal status task');

    await page.getByLabel('Status').click();
    await page.getByRole('option', { name: 'In Progress' }).click();
    await todoPage.saveModal();

    await todoPage.expectTodoVisible('Modal status task');
  });
});
