import { v4 as uuidv4 } from "uuid";
import { isValidDate, isValidPriority } from "./utils";
import { DEFAULT_TODO_TASK_PRIORITY } from "./utils/constants";

export class Todo {
  constructor({ title, description, dueDate, priority, notes, isCompleted }) {
    if (!title) {
      throw new Error("Title is required for a Todo");
    }

    if (priority && !isValidPriority(priority)) {
      throw new Error("A valid priority is required for a Todo");
    }

    if (dueDate && !isValidDate(dueDate)) {
      throw new Error("A valid due date is required for a Todo");
    }

    if (isCompleted && typeof isCompleted !== "boolean") {
      throw new Error("The Todo's isCompleted status must be a boolean");
    }

    this.id = uuidv4();
    this.title = title;
    this.description = description ?? null;
    this.dueDate = dueDate ?? null;
    this.priority = priority ?? DEFAULT_TODO_TASK_PRIORITY;
    this.notes = notes ?? null;
    this.isCompleted = isCompleted ?? false;
  }

  getTodoId() {
    return this.id;
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }

  updateDescription(newDescription) {
    this.description = newDescription;
  }

  updateDueDate(newDueDate) {
    this.dueDate = newDueDate;
  }

  updatePriority(newPriority) {
    this.priority = newPriority;
  }

  updateNotes(newNotes) {
    this.notes = newNotes;
  }

  toggleCompletedStatus() {
    this.isCompleted = !this.isCompleted;
  }
}
