import { DEFAULT_PROJECT_NAME } from "./utils/constants";

export class ProjectManager {
  #Project;
  #Todo;
  #projects;

  constructor(Project, Todo) {
    this.#Project = Project;
    this.#Todo = Todo;
    this.#projects = {
      default: new this.#Project(DEFAULT_PROJECT_NAME),
      myProjects: [],
    };
  }

  findProject(projectId) {
    const allProjects = [this.#projects.default, ...this.#projects.myProjects];
    const foundProject = allProjects.find(
      (project) => project.getProjectId() === projectId
    );

    return foundProject || null;
  }

  addProject(name) {
    if (!name) {
      return null;
    }

    const newProject = new this.#Project(name);

    const newMyProjects = [...this.#projects.myProjects, newProject];
    this.#projects.myProjects = newMyProjects;
  }

  deleteProject(projectId) {
    this.#projects.myProjects = this.#projects.myProjects.filter(
      (project) => project.getProjectId() !== projectId
    );
  }

  addTodo(todoData, projectId) {
    if (!todoData.title) {
      return null;
    }

    const newTodo = new this.#Todo(todoData);

    const foundProject = projectId
      ? this.findProject(projectId)
      : this.#projects.default;

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.addTodo(newTodo);
  }

  updateTodoTitle(projectId, todoId, newTitle) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.updateTodoTitle(todoId, newTitle);
  }

  updateTodoDescription(projectId, todoId, newDescription) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.updateTodoDescription(todoId, newDescription);
  }

  updateTodoDueDate(projectId, todoId, newDueDate) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.updateTodoDueDate(todoId, newDueDate);
  }

  updateTodoPriority(projectId, todoId, newPriority) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.updateTodoPriority(todoId, newPriority);
  }

  updateTodoNotes(projectId, todoId, newNotes) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.updateTodoNotes(todoId, newNotes);
  }

  toggleTodoCompletedStatus(projectId, todoId) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(`Project with id ${projectId} not found`);
      return null;
    }

    foundProject.toggleTodoCompletedStatus(todoId);
  }

  deleteTodo(projectId, todoId) {
    const foundProject = this.findProject(projectId);

    if (!foundProject) {
      console.warn(
        `Project with id ${projectId} not found, cannot delete todo.`
      );
      return null;
    }

    foundProject.deleteTodo(todoId);
  }
}
