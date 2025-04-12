import { ProjectManager } from "./ProjectManager";
import { createElement } from "./utils";

export class UIControls {
  #projectManager;
  #currentProjectId;

  constructor() {
    this.#projectManager = new ProjectManager();
  }

  createAddTaskContainer(projectId) {
    const addTaskContainer = createElement("div", "", "add-task-cta-container");

    const addTaskButton = createElement("button", "", "add-task-cta", {
      "data-project-id":
        projectId || this.#projectManager.getDefaultProject().id,
    });
    addTaskButton.textContent = "Add Task";
    addTaskContainer.append(addTaskButton);

    return addTaskContainer;
  }

  createActionListContainer() {
    const actionListContainer = createElement(
      "div",
      "",
      "action-list-container"
    );

    const actionList = createElement("ul", "", "action-list");

    const defaultProject = this.#projectManager.getDefaultProject();
    const defaultProjectActionItem = createElement(
      "li",
      "",
      "action-list-item"
    );
    const defaultProjectActionItemButton = createElement(
      "button",
      "",
      "default-project",
      {
        "data-project-id": defaultProject.id,
      }
    );
    defaultProjectActionItemButton.textContent = defaultProject.name;
    defaultProjectActionItem.append(defaultProjectActionItemButton);
    actionList.append(defaultProjectActionItem);

    actionListContainer.append(actionList);

    return actionListContainer;
  }

  createMyProjectsContainer() {
    const myProjectsContainer = createElement("div", "", "projects-container");

    const myProjectsHeading = createElement("h2", "", "heading");
    myProjectsHeading.textContent = "My Projects";
    myProjectsContainer.append(myProjectsHeading);

    const projectList = createElement("ul", "", "project-list");
    const myProjects = this.#projectManager.getMyProjects();
    myProjects.forEach((project) => {
      const projectItem = createElement("li", "", "project-list-item");
      const projectItemButton = createElement("button", "", "", {
        "data-project-id": project.id,
      });
      projectItemButton.textContent = project.name;
      projectItem.append(projectItemButton);
      projectList.append(projectItem);
    });
    myProjectsContainer.append(projectList);

    const addProjectContainer = createElement(
      "div",
      "",
      "add-project-cta-container"
    );
    const addProjectButton = createElement("button", "", "add-project-cta");
    addProjectButton.textContent = "Add Project";
    addProjectContainer.append(addProjectButton);
    myProjectsContainer.append(addProjectContainer);

    return myProjectsContainer;
  }

  createSidebar() {
    const sidebarContainer = createElement("div", "", "sidebar");

    const addTaskContainer = this.createAddTaskContainer();
    sidebarContainer.append(addTaskContainer);

    const actionListContainer = this.createActionListContainer();
    sidebarContainer.append(actionListContainer);

    const myProjectsContainer = this.createMyProjectsContainer();
    sidebarContainer.append(myProjectsContainer);

    return sidebarContainer;
  }

  createProjectViewContainer(projectId) {
    const viewContainer = createElement("div", "", "view-container");

    const project = projectId
      ? this.#projectManager.findProject(projectId).getProject()
      : this.#projectManager.getDefaultProject();

    const projectHeading = createElement("h1", "", "heading");
    projectHeading.textContent = project.name;
    viewContainer.append(projectHeading);

    const todoListContainer = createElement("div", "", "todo-list-container");
    const todoList = createElement("ul", "", "todo-list");
    project.todos.forEach((todo) => {
      const todoItem = createElement("li", "", "todo-list-item");
      const todoItemButton = createElement("button", "", "todo", {
        "data-todo-id": todo.id,
      });

      const todoCompletedCheckbox = createElement("input", "", "toggle", {
        type: "checkbox",
        "data-todo-id": todo.id,
      });

      const todoInfoContainer = createElement("div", "", [
        "todo-info",
        `${todo.priority}-priority`,
      ]);
      if (todo.title) {
        const todoTitle = createElement("p", "", "todo-title");
        todoTitle.textContent = todo.title;
        todoInfoContainer.append(todoTitle);
      }
      if (todo.dueDate) {
        const todoDueDate = createElement("p", "", "todo-due-date");
        todoDueDate.textContent = todo.dueDate;
        todoInfoContainer.append(todoDueDate);
      }

      const todoDeleteButton = createElement("button", "", "delete", {
        "data-todo-id": todo.id,
      });
      todoDeleteButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      todoItemButton.append(
        todoCompletedCheckbox,
        todoInfoContainer,
        todoDeleteButton
      );
      todoItem.append(todoItemButton);
      todoList.append(todoItem);
    });
    todoListContainer.append(todoList);
    viewContainer.append(todoListContainer);

    const addTaskContainer = this.createAddTaskContainer(project.id);
    viewContainer.append(addTaskContainer);

    return viewContainer;
  }

  createMainView() {
    const mainViewContainer = createElement("div", "", "main-view");

    const viewContainer = this.createProjectViewContainer();
    mainViewContainer.append(viewContainer);

    return mainViewContainer;
  }

  renderApp() {
    const appContainer = document.querySelector(".todo-app");
    appContainer.innerHTML = "";

    const sidebarContainer = this.createSidebar();
    appContainer.append(sidebarContainer);

    const mainViewContainer = this.createMainView();
    appContainer.append(mainViewContainer);
  }
}
