import { format } from "date-fns";
import { ProjectManager } from "./ProjectManager";
import { createElement, formatDate, isValidString } from "./utils";
import { DEFAULT_TODO_PRIORITY, PRIORITIES } from "./utils/constants";

export class UIControls {
  #projectManager;
  #currentOperation;

  constructor() {
    this.#projectManager = new ProjectManager();
    this.#currentOperation = {
      type: "projectView",
      id: this.#projectManager.getDefaultProject().id,
    };
  }

  createAddTaskContainer(projectId) {
    const addTaskContainer = createElement("div", "", "add-task-cta-container");

    const currentProjectId =
      projectId || this.#projectManager.getDefaultProject().id;
    const addTaskButton = createElement("button", "", "add-task-cta", {
      "data-project-id": currentProjectId,
    });
    addTaskButton.textContent = "Add Task";
    addTaskButton.addEventListener("click", (event) => {
      const todoModal = document.querySelector("#todoModal");
      todoModal.setAttribute("data-project-id", currentProjectId);
      todoModal.showModal();
    });
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
    const isSelected =
      this.#currentOperation.type === "projectView" &&
      this.#currentOperation.id === defaultProject.id;
    const defaultProjectActionItem = createElement("li", "", [
      "action-list-item",
      isSelected ? "active" : "",
    ]);
    const defaultProjectActionItemButton = createElement(
      "button",
      "",
      "default-project",
      {
        "data-project-id": defaultProject.id,
      }
    );
    defaultProjectActionItemButton.textContent = defaultProject.name;
    defaultProjectActionItemButton.addEventListener("click", (event) => {
      this.#currentOperation.type = "projectView";
      this.#currentOperation.id = event.target.dataset.projectId;

      this.renderApp();
    });
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
      const isSelected =
        this.#currentOperation.type === "projectView" &&
        this.#currentOperation.id === project.id;
      const projectItem = createElement("li", "", [
        "project-list-item",
        isSelected ? "active" : "",
      ]);
      const projectItemButton = createElement("button", "", "", {
        "data-project-id": project.id,
      });
      projectItemButton.textContent = project.name;
      projectItemButton.addEventListener("click", (event) => {
        this.#currentOperation.type = "projectView";
        this.#currentOperation.id = event.target.dataset.projectId;

        this.renderApp();
      });
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
    addProjectButton.addEventListener("click", (event) => {
      const projectModal = document.querySelector("#projectModal");
      projectModal.showModal();
    });
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
      const todoItem = createElement("li", "", [
        "todo-list-item",
        todo.isCompleted ? "completed" : "",
      ]);
      const todoItemButton = createElement("button", "", "todo", {
        "data-todo-id": todo.id,
      });
      todoItemButton.addEventListener("click", (event) => {
        const todoModal = document.querySelector("#todoModal");
        todoModal.setAttribute("data-project-id", project.id);
        todoModal.setAttribute("data-todo-id", todo.id);
        todoModal.setAttribute("data-operation-type", "update");

        todoModal.querySelector("#completed").checked = todo.isCompleted;
        todoModal.querySelector("#title").value = todo.title;
        todoModal.querySelector("#description").value = todo.description;
        todoModal.querySelector("#dueDate").value =
          (todo.dueDate || null) && formatDate(todo.dueDate);
        todoModal.querySelector("#priority").value = todo.priority;

        todoModal.showModal();
      });

      const todoCompletedCheckbox = createElement("input", "", "toggle", {
        type: "checkbox",
        "data-todo-id": todo.id,
      });
      todoCompletedCheckbox.checked = todo.isCompleted;
      todoCompletedCheckbox.addEventListener("click", (event) => {
        event.stopPropagation();
      });
      todoCompletedCheckbox.addEventListener("change", (event) => {
        this.#projectManager.toggleTodoCompleteStatus(todo.id, project.id);
        // todoItem.classList.toggle("completed");
        this.renderApp();
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
        todoDueDate.textContent = format(new Date(todo.dueDate), "d MMM yyyy");
        todoInfoContainer.append(todoDueDate);
      }

      const todoDeleteButton = createElement("button", "", "delete", {
        "data-todo-id": todo.id,
      });
      todoDeleteButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      todoDeleteButton.addEventListener("click", (event) => {
        event.stopPropagation();

        this.#projectManager
          .findProject(project.id)
          .deleteTodo(event.target.closest("button.delete").dataset.todoId);

        this.renderApp();
      });

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

    if (this.#currentOperation.type === "projectView") {
      const viewContainer = this.createProjectViewContainer(
        this.#currentOperation.id
      );
      mainViewContainer.append(viewContainer);
    }

    return mainViewContainer;
  }

  createProjectModal() {
    const projectModal = createElement("dialog", "projectModal", "");

    const form = createElement("form", "projectForm", "", { method: "dialog" });

    const projectNameLabel = createElement("label", "", "", {
      for: "projectName",
    });
    projectNameLabel.textContent = "Enter Project Name";
    const projectNameInput = createElement("input", "projectName", "", {
      name: "projectName",
      required: true,
    });

    const modalFooter = createElement("div", "", "modal-footer");
    const cancelButton = createElement("button", "cancelBtn", "", {
      type: "button",
    });
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", (event) => {
      projectModal.close();
    });
    const submitButton = createElement("button", "submitBtn", "primary", {
      type: "submit",
    });
    submitButton.textContent = "Create Project";
    modalFooter.append(cancelButton, submitButton);

    form.append(projectNameLabel, projectNameInput, modalFooter);
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const projectName = formData.get("projectName").trim();
      if (isValidString(projectName)) {
        const newProject = this.#projectManager.addProject(projectName);

        this.#currentOperation.type = "projectView";
        this.#currentOperation.id = newProject.id;
      }

      projectModal.close();
      this.renderApp();
    });
    projectModal.append(form);

    return projectModal;
  }

  createTodoModal() {
    const todoModal = createElement("dialog", "todoModal", "");

    const form = createElement("form", "todoForm", "", { method: "dialog" });

    const modalHeading = createElement("h2", "", "");
    modalHeading.textContent = "Todo Details";

    const todoCompletedStatusContainer = createElement(
      "div",
      "",
      "completed-status"
    );
    const todoCompletedStatusLabel = createElement("label", "", "", {
      for: "completed",
    });
    todoCompletedStatusLabel.textContent = "Todo Completed";
    const todoCompletedStatusInput = createElement("input", "completed", "", {
      name: "completed",
      type: "checkbox",
    });
    todoCompletedStatusContainer.append(
      todoCompletedStatusInput,
      todoCompletedStatusLabel
    );

    const todoTitleContainer = createElement("div", "", "");
    const todoTitleLabel = createElement("label", "", "", {
      for: "title",
    });
    todoTitleLabel.textContent = "Title:";
    const todoTitleInput = createElement("input", "title", "", {
      name: "title",
      type: "text",
      required: true,
    });
    todoTitleContainer.append(todoTitleLabel, todoTitleInput);

    const todoDescriptionContainer = createElement("div", "", "");
    const todoDescriptionLabel = createElement("label", "", "", {
      for: "description",
    });
    todoDescriptionLabel.textContent = "Description:";
    const todoDescriptionInput = createElement("textarea", "description", "", {
      name: "description",
    });
    todoDescriptionContainer.append(todoDescriptionLabel, todoDescriptionInput);

    const todoDueDateContainer = createElement("div", "", "");
    const todoDueDateLabel = createElement("label", "", "", {
      for: "dueDate",
    });
    todoDueDateLabel.textContent = "Due Date:";
    const todoDueDateInput = createElement("input", "dueDate", "", {
      name: "dueDate",
      type: "date",
    });
    todoDueDateContainer.append(todoDueDateLabel, todoDueDateInput);

    const todoPriorityContainer = createElement("div", "", "");
    const todoPriorityLabel = createElement("label", "", "", {
      for: "priority",
    });
    todoPriorityLabel.textContent = "Priority:";
    const todoPrioritySelect = createElement("select", "priority", "", {
      name: "priority",
    });
    PRIORITIES.forEach((priority) => {
      const todoPriorityOption = createElement("option", "", "", {
        value: priority.value,
      });
      todoPriorityOption.textContent = priority.label;
      todoPriorityOption.selected =
        priority.value === DEFAULT_TODO_PRIORITY.value;
      todoPrioritySelect.append(todoPriorityOption);
    });
    todoPriorityContainer.append(todoPriorityLabel, todoPrioritySelect);

    const modalButtonsContainer = createElement("div", "", "dialog-button");
    const cancelButton = createElement("button", "cancelBtn", "", {
      type: "button",
    });
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", (event) => {
      const operationType = todoModal.dataset.operationType;
      todoModal.removeAttribute("data-project-id");
      todoModal.removeAttribute("data-todo-id");
      todoModal.removeAttribute("data-operation-type");

      if (operationType === "update") {
        todoModal.querySelector("#todoForm").reset();
        todoModal.querySelector("#priority").value =
          DEFAULT_TODO_PRIORITY.value;
      }
      todoModal.close();
    });
    const submitButton = createElement("button", "submitBtn", "", {
      type: "submit",
    });
    submitButton.textContent = "Submit";
    modalButtonsContainer.append(cancelButton, submitButton);

    form.append(
      modalHeading,
      todoCompletedStatusContainer,
      todoTitleContainer,
      todoDescriptionContainer,
      todoDueDateContainer,
      todoPriorityContainer,
      modalButtonsContainer
    );
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const todoData = Object.fromEntries(formData.entries());

      const formattedTodoDetails = {};
      formattedTodoDetails.title = todoData.title.trim();
      formattedTodoDetails.description = todoData.description.trim() || null;
      formattedTodoDetails.dueDate =
        (todoData.dueDate && new Date(todoData.dueDate)) || null;
      formattedTodoDetails.priority = todoData.priority;
      formattedTodoDetails.isCompleted = !!todoData.completed;

      const projectId = todoModal.dataset.projectId;
      const todoId = todoModal.dataset.todoId;
      const operationType = todoModal.dataset.operationType;

      if (operationType === "update") {
        this.#projectManager.updateTodo(
          todoId,
          formattedTodoDetails,
          projectId
        );
      } else {
        this.#projectManager.addTodo(formattedTodoDetails, projectId);
      }

      this.#currentOperation.type = "projectView";
      this.#currentOperation.id = projectId;

      todoModal.close();
      this.renderApp();
    });
    todoModal.append(form);

    todoModal.addEventListener("close", (event) => {
      const operationType = todoModal.dataset.operationType;
      todoModal.removeAttribute("data-project-id");
      todoModal.removeAttribute("data-todo-id");
      todoModal.removeAttribute("data-operation-type");

      if (operationType === "update") {
        todoModal.querySelector("#todoForm").reset();
        todoModal.querySelector("#priority").value =
          DEFAULT_TODO_PRIORITY.value;
      }
      todoModal.close();
    });

    return todoModal;
  }

  renderApp() {
    const appContainer = document.querySelector(".todo-app");
    appContainer.innerHTML = "";

    const sidebarContainer = this.createSidebar();
    appContainer.append(sidebarContainer);

    const mainViewContainer = this.createMainView();
    appContainer.append(mainViewContainer);

    const projectModal = this.createProjectModal();
    appContainer.append(projectModal);

    const todoModal = this.createTodoModal();
    appContainer.append(todoModal);
  }
}
