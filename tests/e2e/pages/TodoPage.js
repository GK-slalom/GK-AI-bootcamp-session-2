const { expect } = require('@playwright/test');

/**
 * TodoPage — Page Object Model for the ToDo application.
 * Encapsulates all selectors and actions used across E2E spec files.
 */
class TodoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Add form
    this.titleInput = page.getByLabel('Task Title');
    this.addButton = page.getByRole('button', { name: /add task/i });

    // Filter / sort bar
    this.filterDeadlineToggle = page.getByRole('checkbox', { name: /filter by deadline/i });
    this.sortSelect = page.getByLabel('Sort by');
  }

  /** Navigate to the app */
  async goto() {
    await this.page.goto('/');
    // Wait for the todo list to be visible
    await this.page.waitForSelector('[aria-label="Todo list"]', { state: 'visible', timeout: 10000 }).catch(() => {
      // List may be empty on first load — that's fine
    });
  }

  /**
   * Add a new task via the form.
   * @param {string} title
   * @param {{ deadline?: string }} [opts]
   */
  async addTodo(title, opts = {}) {
    await this.titleInput.fill(title);
    if (opts.deadline) {
      await this.page.getByLabel('Deadline (optional)').fill(opts.deadline);
    }
    await this.addButton.click();
  }

  /**
   * Get the todo card element for a given title.
   * @param {string} title
   */
  getTodoCard(title) {
    return this.page.getByLabel(`Task: ${title}`);
  }

  /**
   * Click the Edit button for a todo.
   * @param {string} title
   */
  async clickEdit(title) {
    const card = this.getTodoCard(title);
    await card.getByLabel('Edit').click();
  }

  /**
   * Click the Delete button for a todo.
   * @param {string} title
   */
  async clickDelete(title) {
    const card = this.getTodoCard(title);
    await card.getByLabel('Delete').click();
  }

  /**
   * Change the status of a todo using its inline status selector.
   * @param {string} title
   * @param {string} statusLabel - e.g. 'Done'
   */
  async changeStatus(title, statusLabel) {
    const card = this.getTodoCard(title);
    const select = card.getByLabel('Status');
    await select.click();
    await this.page.getByRole('option', { name: statusLabel }).click();
  }

  /**
   * Save the edit modal.
   */
  async saveModal() {
    await this.page.getByRole('button', { name: /save/i }).click();
  }

  /**
   * Close the edit modal without saving.
   */
  async cancelModal() {
    await this.page.getByRole('button', { name: /cancel/i }).click();
  }

  /**
   * Assert that a todo title is visible on screen.
   * @param {string} title
   */
  async expectTodoVisible(title) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  /**
   * Assert that a todo title is not visible on screen.
   * @param {string} title
   */
  async expectTodoNotVisible(title) {
    await expect(this.page.getByText(title)).not.toBeVisible();
  }
}

module.exports = { TodoPage };
