// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

/**
 * E2E: Edit and delete tasks.
 */
test.describe('Edit and delete a task', () => {
  test('user can edit the title of a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task to edit');
    await todoPage.expectTodoVisible('Task to edit');

    await todoPage.clickEdit('Task to edit');

    // Update the title in the modal
    const modalTitle = page.getByLabel('Task Title');
    await modalTitle.clear();
    await modalTitle.fill('Edited task title');
    await todoPage.saveModal();

    await todoPage.expectTodoVisible('Edited task title');
  });

  test('user can add notes to a task via edit modal', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task for notes');
    await todoPage.clickEdit('Task for notes');

    await page.getByLabel('Notes').fill('These are my notes');
    await todoPage.saveModal();

    await expect(page.getByText('These are my notes')).toBeVisible();
  });

  test('user can delete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task to delete');
    await todoPage.expectTodoVisible('Task to delete');

    await todoPage.clickDelete('Task to delete');
    await todoPage.expectTodoNotVisible('Task to delete');
  });

  test('cancel button closes the edit modal without saving', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task cancel test');
    await todoPage.clickEdit('Task cancel test');

    const modalTitle = page.getByLabel('Task Title');
    await modalTitle.clear();
    await modalTitle.fill('Should not be saved');
    await todoPage.cancelModal();

    await todoPage.expectTodoVisible('Task cancel test');
  });
});
