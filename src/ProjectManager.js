import { Project } from "./Project";
import { DEFAULT_PROJECT_NAME } from "./utils/constants";

/**
 * Manages a collection of Project objects.
 */
export class ProjectManager {
  #projects = {
    default: null,
    myProjects: [],
  };

  /**
   * Constructor for the ProjectManager class.
   * Initializes the default {@link DEFAULT_PROJECT_NAME} project.
   * @throws {Error} If failed to create default project.
   */
  constructor() {
    try {
      this.#projects.default = new Project({
        name: DEFAULT_PROJECT_NAME,
        todos: [],
      });
    } catch (error) {
      throw new Error(
        `Failed to create default project ${DEFAULT_PROJECT_NAME}: ${error.message}`
      );
    }
  }

  /**
   * Finds a project by its ID.
   * @param {string} projectId The ID of the project to find.
   * @returns {Project | null} The project if found, otherwise null.
   * @throws {Error} If projectId is not provided.
   * @throws {Error} If an error occurs while finding the project.
   */
  findProject(projectId) {
    if (!projectId) {
      throw new Error(
        "findProject method requires a projectId to locate a project."
      );
    }

    try {
      const allProjects = [
        this.#projects.default,
        ...this.#projects.myProjects,
      ];

      const foundProject = allProjects.find(
        (project) => project.getProjectId() === projectId
      );

      return foundProject || null;
    } catch (error) {
      throw new Error(`Error occurred while finding project: ${error.message}`);
    }
  }

  /**
   * Adds a new project with the given name.
   * @param {string} projectName The name of the new project.
   * @throws {Error} If projectName is not provided.
   * @throws {Error} If failed to add project.
   */
  addProject(projectName) {
    if (!projectName) {
      throw new Error(
        "addProject method requires a projectName to create a new project."
      );
    }

    try {
      const newProject = new Project({ name: projectName, todos: [] });

      this.#projects.myProjects = [...this.#projects.myProjects, newProject];
    } catch (error) {
      throw new Error(`Failed to add project: ${error.message}`);
    }
  }

  /**
   * Updates the name of an existing project.
   * @param {string} projectId The ID of the project to update.
   * @param {string} newProjectName The new name for the project.
   * @throws {Error} If projectId or newProjectName is not provided.
   * @throws {Error} If attempting to update the default {@link DEFAULT_PROJECT_NAME} project.
   * @throws {Error} If no project is found with the given ID.
   * @throws {Error} If failed to update project name.
   */
  updateProjectName(projectId, newProjectName) {
    if (!projectId) {
      throw new Error(
        "updateProjectName method requires a projectId to update the project name."
      );
    }
    if (!newProjectName) {
      throw new Error(
        "updateProjectName method requires a newProjectName to update the project name."
      );
    }

    if (this.#projects.default.getProjectId() === projectId) {
      throw new Error(
        `Cannot update the name of the default ${DEFAULT_PROJECT_NAME} project.`
      );
    }

    try {
      const foundProject = this.findProject(projectId);

      if (!foundProject) {
        throw new Error(
          `No project found with the ID ${projectId}. Cannot update project name.`
        );
      }

      foundProject.updateProjectName(newProjectName);
    } catch (error) {
      throw new Error(`Failed to update project name: ${error.message}`);
    }
  }

  /**
   * Updates an existing project with the given details.
   * @param {string} projectId The ID of the project to update.
   * @param {object} projectDetails An object containing the project details to update.
   * @throws {Error} If projectId or projectDetails is not provided.
   * @throws {Error} If attempting to update the default {@link DEFAULT_PROJECT_NAME} project.
   * @throws {Error} If no project is found with the given ID.
   * @throws {Error} If projectDetails is invalid.
   * @throws {Error} If failed to update project.
   */
  updateProject(projectDetails, projectId) {
    if (!projectId) {
      throw new Error(
        "updateProject method requires a projectId to update the project."
      );
    }
    if (!projectDetails || typeof projectDetails !== "object") {
      throw new Error(
        "updateProject method requires a projectDetails object to update the project."
      );
    }

    if (this.#projects.default.getProjectId() === projectId) {
      throw new Error(
        `Cannot update the default ${DEFAULT_PROJECT_NAME} project.`
      );
    }

    try {
      const foundProject = this.findProject(projectId);

      if (!foundProject) {
        throw new Error(
          `No project found with the ID ${projectId}. Cannot update project.`
        );
      }

      foundProject.updateProject(projectDetails);
    } catch (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  /**
   * Deletes a project.
   * @param {string} projectId The ID of the project to delete.
   * @throws {Error} If projectId is not provided.
   * @throws {Error} If attempting to delete the default {@link DEFAULT_PROJECT_NAME} project.
   * @throws {Error} If no project is found with the given ID.
   */
  deleteProject(projectId) {
    if (!projectId) {
      throw new Error(
        "deleteProject method requires a projectId to delete the project."
      );
    }

    if (this.#projects.default.getProjectId() === projectId) {
      throw new Error(
        `Cannot delete the default ${DEFAULT_PROJECT_NAME} project.`
      );
    }

    const initialProjectsLength = this.#projects.myProjects.length;

    this.#projects.myProjects = this.#projects.myProjects.filter(
      (project) => project.getProjectId() !== projectId
    );

    if (this.#projects.myProjects.length === initialProjectsLength) {
      throw new Error(
        `No project found with the ID ${projectId}. Cannot delete project.`
      );
    }
  }

  /**
   * Adds a todo to a project.  If no projectId is provided, the todo is added to the default project.
   * @param {object} todoDetails The details of the todo to add.
   * @param {string} [projectId] The ID of the project to add the todo to.  If not provided, the todo is added to the default project.
   * @throws {Error} If todoDetails is not provided or is not an object.
   * @throws {Error} If the project with the given ID is not found.
   * @throws {Error} If an error occurs while adding the todo.
   */
  addTodo(todoDetails, projectId) {
    if (!todoDetails || typeof todoDetails !== "object") {
      throw new Error(
        "addTodo method requires a todoDetails object to add a todo."
      );
    }

    let foundProject;

    try {
      if (projectId) {
        foundProject = this.findProject(projectId);
        if (!foundProject) {
          throw new Error(
            `No project found with the ID ${projectId}. Cannot add todo.`
          );
        }
      } else {
        foundProject = this.#projects.default;
        if (!foundProject) {
          // This should ideally never happen, but it's good to be defensive
          throw new Error(
            `Default ${DEFAULT_PROJECT_NAME} project not found.  Please report this issue.`
          );
        }
      }

      foundProject.addTodo(todoDetails);
    } catch (error) {
      throw new Error(`Failed to add todo: ${error.message}`);
    }
  }

  /**
   * Updates a todo in a project.  If no projectId is provided, the todo is updated in the default project.
   * @param {string} todoId The ID of the todo to update.
   * @param {object} todoDetails The details of the todo to update.
   * @param {string} [projectId] The ID of the project to update the todo in.  If not provided, the todo is updated in the default project.
   * @throws {Error} If todoId or todoDetails is not provided or if todoDetails is not an object.
   * @throws {Error} If the project with the given ID is not found.
   * @throws {Error} If an error occurs while updating the todo.
   */
  updateTodo(todoId, todoDetails, projectId) {
    if (!todoId) {
      throw new Error(
        "updateTodo method requires a todoId to update the todo."
      );
    }
    if (!todoDetails || typeof todoDetails !== "object") {
      throw new Error(
        "updateTodo method requires a todoDetails object to update a todo."
      );
    }

    let foundProject;

    try {
      if (projectId) {
        foundProject = this.findProject(projectId);
        if (!foundProject) {
          throw new Error(
            `No project found with the ID ${projectId}. Cannot update todo.`
          );
        }
      } else {
        foundProject = this.#projects.default;
        if (!foundProject) {
          // This should ideally never happen, but it's good to be defensive
          throw new Error(
            `Default ${DEFAULT_PROJECT_NAME} project not found.  Please report this issue.`
          );
        }
      }

      foundProject.updateTodo(todoId, todoDetails);
    } catch (error) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }
  }

  /**
   * Toggles the complete status of a todo in a project. If no projectId is provided, the todo is toggled in the default project.
   * @param {string} todoId The ID of the todo to toggle.
   * @param {string} [projectId] The ID of the project to toggle the todo in. If not provided, the todo is toggled in the default project.
   * @throws {Error} If todoId is not provided.
   * @throws {Error} If the project with the given ID is not found.
   * @throws {Error} If an error occurs while toggling the todo status.
   */
  toggleTodoCompleteStatus(todoId, projectId) {
    if (!todoId) {
      throw new Error(
        "toggleTodoCompleteStatus method requires a todoId to toggle the todo status."
      );
    }

    let foundProject;

    try {
      if (projectId) {
        foundProject = this.findProject(projectId);
        if (!foundProject) {
          throw new Error(
            `No project found with the ID ${projectId}. Cannot toggle todo status.`
          );
        }
      } else {
        foundProject = this.#projects.default;
        if (!foundProject) {
          // This should ideally never happen, but it's good to be defensive
          throw new Error(
            `Default ${DEFAULT_PROJECT_NAME} project not found. Please report this issue.`
          );
        }
      }

      foundProject.toggleTodoCompleteStatus(todoId);
    } catch (error) {
      throw new Error(`Failed to toggle todo status: ${error.message}`);
    }
  }

  /**
   * Deletes a todo from a project. If no projectId is provided, the todo is deleted from the default project.
   * @param {string} todoId The ID of the todo to delete.
   * @param {string} [projectId] The ID of the project to delete the todo from. If not provided, the todo is deleted from the default project.
   * @throws {Error} If todoId is not provided.
   * @throws {Error} If the project with the given ID is not found.
   * @throws {Error} If an error occurs while deleting the todo.
   */
  deleteTodo(todoId, projectId) {
    if (!todoId) {
      throw new Error(
        "deleteTodo method requires a todoId to delete the todo."
      );
    }

    let foundProject;

    try {
      if (projectId) {
        foundProject = this.findProject(projectId);
        if (!foundProject) {
          throw new Error(
            `No project found with the ID ${projectId}. Cannot delete todo.`
          );
        }
      } else {
        foundProject = this.#projects.default;
        if (!foundProject) {
          // This should ideally never happen, but it's good to be defensive
          throw new Error(
            `Default ${DEFAULT_PROJECT_NAME} project not found. Please report this issue.`
          );
        }
      }

      foundProject.deleteTodo(todoId);
    } catch (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }
}
