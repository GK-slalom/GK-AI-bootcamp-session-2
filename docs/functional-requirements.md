# Functional Requirements

## Overview

We are building a ToDo application that allows users to manage their tasks effectively.

## Requirements

### 1. Create a Task
- The user can create a new task.
- An optional deadline can be specified when creating a task.

### 2. Delete a Task
- The user can delete an existing task.

### 3. Update a Task
- The user can edit and update the details of an existing task.

### 4. Mark a Task as Complete
- The user can mark a task as complete.
- When a task is marked as complete, the task text should be displayed with a strikethrough style.

### 5. Add Notes to a Task
- The user can add notes to an existing task.

### 6. Move a Task to Another Deadline
- The user can change the deadline of an existing task, effectively moving it to a different date.

### 7. Change Task Status
- The user can change the status of a task.
- Allowed statuses:
  - To Do
  - In Progress
  - Done

### 8. Sort Tasks / Add Priority
- The user can sort tasks or assign a priority to tasks.

### 9. Filter Tasks by Deadline Date
- The user can filter tasks by deadline date.
- When filtering is applied, tasks without a deadline date should appear at the bottom of the list.

### 10. Highlight Tasks Due Today
- Tasks that are due today should be displayed in **orange**.

### 11. Highlight Overdue Tasks
- Tasks that are past their due date should be displayed in **red**.
