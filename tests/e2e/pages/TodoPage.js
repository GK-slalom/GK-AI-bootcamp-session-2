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
    this.titleInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: /add task/i });

    // Filter / sort bar — use data-testid for reliability
    this.filterDeadlineToggle = page.locator('[data-testid="filter-deadline-toggle"]');
    this.sortSelect = page.getByLabel('Sort by');

    // Modal dialog
    this.dialog = page.getByRole('dialog');
  }

  /** Navigate to the app */
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill a MUI DatePicker by clicking its group and typing MM DD YYYY.
   * @param {import('@playwright/test').Locator} pickerContainer - locator for the textField root (via data-testid)
   * @param {string} date - MM/DD/YYYY format
   */
  async fillDatePicker(pickerContainer, date) {
    const [month, day, year] = date.split('/');
    // Click the picker field to focus it
    await pickerContainer.click();
    // Type each section value — MUI DatePicker sections advance automatically
    await this.page.keyboard.type(month);
    await this.page.keyboard.type(day);
    await this.page.keyboard.type(year);
    // Press Escape to close any open calendar
    await this.page.keyboard.press('Escape');
  }

  /**
   * Add a new task via the form.
   * @param {string} title
   * @param {{ deadline?: string }} [opts]
   */
  async addTodo(title, opts = {}) {
    await this.titleInput.click();
    await this.titleInput.fill(title);
    if (opts.deadline) {
      const deadlinePicker = this.page.locator('[data-testid="add-deadline-picker"]');
      await this.fillDatePicker(deadlinePicker, opts.deadline);
    }
    await this.addButton.click();
    await this.page.waitForTimeout(400);
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
    await this.dialog.waitFor({ state: 'visible' });
  }

  /**
   * Click the Delete button for a todo.
   * @param {string} title
   */
  async clickDelete(title) {
    const card = this.getTodoCard(title);
    await card.getByLabel('Delete').click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Change the status of a todo using its inline status selector on the card.
   * @param {string} title
   * @param {string} statusLabel - e.g. 'Done'
   */
  async changeStatus(title, statusLabel) {
    const card = this.getTodoCard(title);
    await card.getByRole('combobox').click();
    await this.page.getByRole('option', { name: statusLabel }).click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Fill a field inside the edit modal by its label.
   * Scoped to the dialog to avoid strict mode violations with the add form.
   * @param {string} label
   * @param {string} value
   */
  async fillModalField(label, value) {
    const field = this.dialog.getByLabel(label);
    await field.clear();
    await field.fill(value);
  }

  /**
   * Change the status inside the edit modal.
   * @param {string} statusLabel
   */
  async selectModalStatus(statusLabel) {
    await this.dialog.getByRole('combobox', { name: /status/i }).click();
    await this.page.getByRole('option', { name: statusLabel }).click();
  }

  /**
   * Fill the deadline date picker inside the edit modal.
   * @param {string} date - MM/DD/YYYY
   */
  async fillModalDeadline(date) {
    const deadlinePicker = this.dialog.locator('[data-testid="modal-deadline-picker"]');
    await this.fillDatePicker(deadlinePicker, date);
  }

  /**
   * Save the edit modal.
   */
  async saveModal() {
    await this.dialog.getByRole('button', { name: /save/i }).click();
    await this.dialog.waitFor({ state: 'hidden' });
  }

  /**
   * Close the edit modal without saving.
   */
  async cancelModal() {
    await this.dialog.getByRole('button', { name: /cancel/i }).click();
    await this.dialog.waitFor({ state: 'hidden' });
  }

  /**
   * Assert that a todo title is visible on screen.
   * @param {string} title
   */
  async expectTodoVisible(title) {
    await expect(this.page.getByText(title).first()).toBeVisible();
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
