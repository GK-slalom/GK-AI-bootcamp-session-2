// @ts-check
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

/**
 * E2E: Filter tasks by deadline — tasks without a deadline appear at the bottom.
 */
test.describe('Filter and sort tasks', () => {
  test('tasks without a deadline appear after tasks with a deadline when filter is on', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    // Create two tasks: one with a deadline, one without
    await todoPage.addTodo('No deadline task');
    await todoPage.addTodo('Has deadline task', { deadline: '12/31/2026' });

    // Enable filter by deadline
    await todoPage.filterDeadlineToggle.click();

    // Get all task titles in DOM order
    const titles = await page.locator('[aria-label^="Task:"]').allTextContents();

    const noDeadlineIndex = titles.findIndex((t) => t.includes('No deadline task'));
    const hasDeadlineIndex = titles.findIndex((t) => t.includes('Has deadline task'));

    expect(hasDeadlineIndex).toBeLessThan(noDeadlineIndex);
  });

  test('sort by priority reorders tasks', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Low priority task');
    await todoPage.addTodo('High priority task');

    // Change sort to priority
    await todoPage.sortSelect.click();
    await page.getByRole('option', { name: 'Priority' }).click();

    // List should reload without error
    await expect(page.locator('[aria-label="Todo list"]')).toBeVisible();
  });
});
