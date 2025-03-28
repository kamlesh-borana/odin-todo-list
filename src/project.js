import { v4 as uuidv4 } from "uuid";

export class Project {
  constructor(name) {
    if (!name) {
      throw new Error("Project name is required");
    }

    this.id = uuidv4();
    this.name = name;
    this.todos = [];
  }

  getProjectId() {
    return this.id;
  }

  updateName(newName) {
    this.name = newName;
  }

  findTodo(todoId) {
    const foundTodo = this.todos.find((todo) => todo.getTodoId() === todoId);

    return foundTodo || null;
  }

  addTodo(newTodo) {
    this.todos = [...this.todos, newTodo];
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter((todo) => todo.getTodoId() !== todoId);
  }

  updateTodoTitle(todoId, newTitle) {
    const foundTodo = this.findTodo(todoId);

    if (!foundTodo) {
      console.warn(`Todo with ID ${todoId} not found.`);
      return null;
    }

    foundTodo.updateTitle(newTitle);
  }

  updateTodoDescription(todoId, newDescription) {
    const foundTodo = this.findTodo(todoId);

    if (!foundTodo) {
      console.warn(`Todo with ID ${todoId} not found.`);
      return null;
    }

    foundTodo.updateDescription(newDescription);
  }

  updateTodoDueDate(todoId, newDueDate) {
    const foundTodo = this.findTodo(todoId);

    if (!foundTodo) {
      console.warn(`Todo with ID ${todoId} not found.`);
      return null;
    }

    foundTodo.updateDueDate(newDueDate);
  }

  updateTodoPriority(todoId, newPriority) {
    const foundTodo = this.findTodo(todoId);

    if (!foundTodo) {
      console.warn(`Todo with ID ${todoId} not found.`);
      return null;
    }

    foundTodo.updatePriority(newPriority);
  }

  updateTodoNotes(todoId, newNotes) {
    const foundTodo = this.findTodo(todoId);

    if (!foundTodo) {
      console.warn(`Todo with ID ${todoId} not found.`);
      return null;
    }

    foundTodo.updateNotes(newNotes);
  }

  toggleTodoCompletedStatus(todoId) {
    const foundTodo = this.findTodo(todoId);

    if (!foundTodo) {
      console.warn(`Todo with ID ${todoId} not found.`);
      return null;
    }

    foundTodo.toggleCompletedStatus();
  }
}
