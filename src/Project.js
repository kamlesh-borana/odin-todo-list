import { Todo } from "./Todo";
import {
  generateRandomId,
  isValidId,
  isValidObject,
  isValidString,
  replacePlaceholders,
} from "./utils";
import { MINIMUM_PROJECT_NAME_CHARACTER_LENGTH } from "./utils/constants";
import { validateObject } from "./utils/validation";

class ProjectValidations {
  validateProjectId(projectId) {
    if (projectId === undefined) {
      return {
        isValid: false,
        msg: "{{methodName}} requires an id property. The id property must be a UUID string.",
      };
    }

    if (typeof projectId !== "string") {
      return {
        isValid: false,
        msg: `{{methodName}} expects id to be a string, but received type ${typeof projectId}. The id property must be a UUID string.`,
      };
    }

    if (!isValidId(projectId)) {
      return {
        isValid: false,
        msg: "{{methodName}}: id has an invalid UUID format. The id must be a string matching the UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.",
      };
    }

    return { isValid: true, msg: "Project id contains valid data." };
  }

  validateProjectName(projectName) {
    if (projectName === undefined) {
      return {
        isValid: false,
        msg: `{{methodName}} requires a name property. The name property must be a non-empty string with at least ${MINIMUM_PROJECT_NAME_CHARACTER_LENGTH} character(s).`,
      };
    }

    if (typeof projectName !== "string") {
      return {
        isValid: false,
        msg: `{{methodName}} expects name to be a string, but received type ${typeof projectName}. The name property must be a non-empty string with at least ${MINIMUM_PROJECT_NAME_CHARACTER_LENGTH} character(s).`,
      };
    }

    if (projectName.length < MINIMUM_PROJECT_NAME_CHARACTER_LENGTH) {
      return {
        isValid: false,
        msg: `{{methodName}}: name must be at least ${MINIMUM_PROJECT_NAME_CHARACTER_LENGTH} character(s) long. The provided name has a length of ${projectName.length}.`,
      };
    }

    if (!isValidString(projectName)) {
      return {
        isValid: false,
        msg: "{{methodName}}: name contains invalid characters or formatting. The name must not have leading or trailing whitespace, must not contain multiple consecutive spaces, must not contain any whitespace characters other than a single space to separate words, and must contain at least one non-whitespace character.",
      };
    }

    return { isValid: true, msg: "Project name contains valid data." };
  }

  validateProjectTodos(newTodos) {
    if (newTodos === undefined) {
      return {
        isValid: false,
        msg: "{{methodName}} requires a todos property. The todos property must be an array (empty or containing objects).",
      };
    }

    if (!Array.isArray(newTodos)) {
      return {
        isValid: false,
        msg: `{{methodName}} expects todos to be an array, but received type ${typeof newTodos}. The todos property must be an array (empty or containing objects).`,
      };
    }

    for (let i = 0; i < newTodos.length; i++) {
      const todo = newTodos[i];
      if (!isValidObject(todo)) {
        return {
          isValid: false,
          msg: `{{methodName}}: todos array contains an invalid element of type ${typeof todo} at index ${i}. All elements in the todos array must be objects.`,
        };
      }
    }

    return { isValid: true, msg: "Project todos contains valid data." };
  }

  validateProject({ id, name, todos }) {
    const validationResult = { isValid: false, msg: [] };

    function addErrorInValidationResult(validationErrorMsg) {
      validationResult.isValid = false;
      validationResult.msg.push(validationErrorMsg);
    }

    const projectIdValidationResult = this.validateProjectId(id);
    const projectNameValidationResult = this.validateProjectName(name);
    const projectTodosValidationResult = this.validateProjectTodos(todos);

    if (!projectIdValidationResult.isValid) {
      addErrorInValidationResult(projectIdValidationResult.msg);
    }

    if (!projectNameValidationResult.isValid) {
      addErrorInValidationResult(projectNameValidationResult.msg);
    }

    if (!projectTodosValidationResult.isValid) {
      addErrorInValidationResult(projectTodosValidationResult.msg);
    }

    if (
      projectIdValidationResult.isValid &&
      projectNameValidationResult.isValid &&
      projectTodosValidationResult.isValid
    ) {
      validationResult.isValid = true;
      validationResult.msg = ["Project contains valid data."];
    }

    return validationResult;
  }
}

export class Project {
  #id;
  #name;
  #todos;
  #validations;

  constructor(projectDetails) {
    validateObject(
      projectDetails,
      "Project constructor expects a non-null object as input. Received: null.",
      "Project constructor expects an object, but received an array. Provide an object with properties for the Project item.",
      `Project constructor expects an object, but received a primitive value of type ${typeof projectDetails}. Provide an object with properties for the Project item.`
    );

    this.#validations = new ProjectValidations();

    const defaultProjectDetails = {
      id: generateRandomId(),
      name: null,
      todos: [],
    };

    const newProjectDetails = { ...defaultProjectDetails, ...projectDetails };

    const validationResult =
      this.#validations.validateProject(newProjectDetails);

    if (!validationResult.isValid) {
      throw new Error(
        replacePlaceholders(validationResult.msg.join(" "), {
          methodName: "Project constructor",
        })
      );
    }

    const { id, name, todos } = newProjectDetails;

    const createdTodos = todos.map((todo, index) => {
      try {
        return new Todo(todo);
      } catch (todoError) {
        throw new Error(
          `Failed to create Todo at index ${index}: ${todoError.message}`
        );
      }
    });

    this.#id = id;
    this.#name = name;
    this.#todos = createdTodos;
  }

  getProject() {
    return JSON.parse(
      JSON.stringify({ id: this.#id, name: this.#name, todos: this.#todos })
    );
  }

  getProjectId() {
    return this.#id;
  }

  getProjectName() {
    return this.#name;
  }

  updateProjectName(name) {
    const validationResult = this.#validations.validateProjectName(name);

    if (!validationResult.isValid) {
      throw new Error(
        replacePlaceholders(validationResult.msg, {
          methodName: "updateProjectName method",
        })
      );
    }

    this.#name = newProjectName;
  }

  updateProjectTodos(todos) {
    const validationResult = this.#validations.validateProjectTodos(todos);
    if (!validationResult.isValid) {
      throw new Error(
        replacePlaceholders(validationResult.msg, {
          methodName: "updateProjectTodos method",
        })
      );
    }

    const createdTodos = todos.map((todo, index) => {
      try {
        return new Todo(todo);
      } catch (todoError) {
        throw new Error(
          `Failed to create Todo at index ${index}: ${todoError.message}`
        );
      }
    });

    this.#todos = createdTodos;
  }

  updateProject(projectDetails) {
    validateObject(
      projectDetails,
      "updateProject method expects a non-null object as input. Received: null.",
      "updateProject method expects an object, but received an array. Provide an object with properties for the Project item.",
      `updateProject method expects an object, but received a primitive value of type ${typeof projectDetails}. Provide an object with properties for the Project item.`
    );

    const currentProjectDetails = {
      id: this.#id,
      name: this.#name,
      todos: this.#todos,
    };
    const updatedProjectDetails = {
      ...currentProjectDetails,
      ...projectDetails,
    };

    const validationResult = this.#validations.validateProject(
      updatedProjectDetails
    );
    if (!validationResult.isValid) {
      throw new Error(
        replacePlaceholders(validationResult.msg.join(" "), {
          methodName: "updateProject method",
        })
      );
    }

    const { name, todos } = updatedProjectDetails;

    const createdTodos = todos.map((todo, index) => {
      try {
        return new Todo(todo);
      } catch (todoError) {
        throw new Error(
          `Failed to create Todo at index ${index}: ${todoError.message}`
        );
      }
    });

    this.#name = name;
    this.#todos = createdTodos;
  }

  findTodo(todoId) {
    const foundTodo = this.#todos.find((todo) => todo.getTodoId() === todoId);

    return foundTodo || null;
  }

  getTodo(todoId) {
    try {
      const todo = this.findTodo(todoId);

      if (!todo) {
        throw new Error(
          `Todo retrieval failed: No Todo found with the ID ${todoId} within project ${
            this.#name
          } (ID: ${
            this.#id
          }). Please ensure the ID is correct and the Todo exists in this project.`
        );
      }

      return todo.getTodo();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  addTodo(todoDetails) {
    try {
      const createdTodo = new Todo(todoDetails);
      this.#todos = [...this.#todos, createdTodo];
    } catch (error) {
      throw new Error(`Failed to create Todo: ${error.message}`);
    }
  }

  updateTodo(todoId, todoDetails) {
    try {
      const foundTodo = this.findTodo(todoId);

      if (!foundTodo) {
        throw new Error(
          `Todo update failed: No Todo found with the ID ${todoId} within project ${
            this.#name
          } (ID: ${
            this.#id
          }). Please ensure the ID is correct and the Todo exists in this project.`
        );
      }

      foundTodo.updateTodo(todoDetails);
    } catch (error) {
      throw new Error(`Failed to update Todo: ${error.message}`);
    }
  }

  toggleTodoCompleteStatus(todoId) {
    try {
      const foundTodo = this.findTodo(todoId);

      if (!foundTodo) {
        throw new Error(
          `Todo toggle completion status failed: No Todo found with the ID ${todoId} within project ${
            this.#name
          } (ID: ${
            this.#id
          }). Please ensure the ID is correct and the Todo exists in this project.`
        );
      }

      foundTodo.toggleTodoCompleteStatus();
    } catch (error) {
      throw new Error(
        `Failed to toggle Todo completion status: ${error.message}`
      );
    }
  }

  deleteTodo(todoId) {
    const initialTodosLength = this.#todos.length;

    this.#todos = this.#todos.filter((todo) => todo.getTodoId() !== todoId);

    if (initialTodosLength === this.#todos.length) {
      throw new Error(
        `Todo deletion failed: No Todo found with the ID ${todoId} within project ${
          this.#name
        } (ID: ${
          this.#id
        }). Please ensure the ID is correct and the Todo exists in this project.`
      );
    }
  }
}
