import {
  generateRandomId,
  isValidId,
  isValidString,
  replacePlaceholders,
} from "./utils";
import {
  DEFAULT_TODO_PRIORITY,
  MINIMUM_TODO_TITLE_CHARACTER_LENGTH,
  PRIORITIES,
} from "./utils/constants";
import { validateObject } from "./utils/validation";

export class TodoValidations {
  validateTodoId(todoId) {
    if (todoId === undefined) {
      return {
        isValid: false,
        msg: "{{methodName}} requires an id property. The id property must be a UUID string.",
      };
    }

    if (typeof todoId !== "string") {
      return {
        isValid: false,
        msg: `{{methodName}} expects id to be a string, but received type ${typeof todoId}. The id property must be a UUID string.`,
      };
    }

    if (!isValidId(todoId)) {
      return {
        isValid: false,
        msg: "{{methodName}}: id has an invalid UUID format. The id must be a string matching the UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.",
      };
    }

    return { isValid: true, msg: "Todo id contains valid data." };
  }

  validateTodoTitle(todoTitle) {
    if (todoTitle === undefined) {
      return {
        isValid: false,
        msg: `{{methodName}} requires a title property. The title property must be a non-empty string with at least ${MINIMUM_TODO_TITLE_CHARACTER_LENGTH} character(s).`,
      };
    }

    if (typeof todoTitle !== "string") {
      return {
        isValid: false,
        msg: `{{methodName}} expects title to be a string, but received type ${typeof todoTitle}. The title property must be a non-empty string with at least ${MINIMUM_TODO_TITLE_CHARACTER_LENGTH} character(s).`,
      };
    }

    if (todoTitle.length < MINIMUM_TODO_TITLE_CHARACTER_LENGTH) {
      return {
        isValid: false,
        msg: `{{methodName}}: title must be at least ${MINIMUM_TODO_TITLE_CHARACTER_LENGTH} character(s) long. The provided title has a length of ${todoTitle.length}.`,
      };
    }

    if (!isValidString(todoTitle)) {
      return {
        isValid: false,
        msg: "{{methodName}}: title contains invalid characters or formatting. The title must not have leading or trailing whitespace, must not contain multiple consecutive spaces, must not contain any whitespace characters other than a single space to separate words, and must contain at least one non-whitespace character.",
      };
    }

    return { isValid: true, msg: "Todo title contains valid data." };
  }

  validateTodoDescription(todoDescription) {
    if (todoDescription === undefined) {
      return {
        isValid: false,
        msg: "{{methodName}} requires a description property. The description property must be a non-empty string or null.",
      };
    }

    if (typeof todoDescription !== "string" && todoDescription !== null) {
      return {
        isValid: false,
        msg: `{{methodName}} expects description to be a string or null, but received type ${typeof todoDescription}. The description property must be a non-empty string or null.`,
      };
    }

    if (
      typeof todoDescription === "string" &&
      !isValidString(todoDescription)
    ) {
      return {
        isValid: false,
        msg: "{{methodName}}: description contains invalid characters or formatting. The description must not have leading or trailing whitespace, must not contain multiple consecutive spaces, must not contain any whitespace characters other than a single space to separate words, and must contain at least one non-whitespace character.",
      };
    }

    return { isValid: true, msg: "Todo description contains valid data." };
  }

  validateTodoDueDate(todoDueDate) {
    if (todoDueDate === undefined) {
      return {
        isValid: false,
        msg: "{{methodName}} requires a dueDate property. The dueDate property must be a Date object representing the due date or null.",
      };
    }

    if (!(todoDueDate instanceof Date) && todoDueDate !== null) {
      return {
        isValid: false,
        msg: `{{methodName}} expects dueDate to be a Date object or null, but received type ${typeof todoDueDate}. The dueDate property must be a Date object representing the due date or null.`,
      };
    }

    return { isValid: true, msg: "Todo due date contains valid data." };
  }

  validateTodoPriority(todoPriority) {
    const priorityLevels = PRIORITIES.map((priority) => priority.value);
    const priorityLevelsText = `${priorityLevels
      .slice(0, -1)
      .join(", ")} or ${priorityLevels.slice(-1)}`;
    if (todoPriority === undefined) {
      return {
        isValid: false,
        msg: `{{methodName}} requires a priority property. The priority property must be a string representing the priority level (${priorityLevelsText}).`,
      };
    }

    if (typeof todoPriority !== "string") {
      return {
        isValid: false,
        msg: `{{methodName}} expects priority to be a string, but received type ${typeof todoPriority}. The priority property must be a string representing the priority level (${priorityLevelsText}).`,
      };
    }

    if (!priorityLevels.includes(todoPriority)) {
      return {
        isValid: false,
        msg: `{{methodName}}: priority has an invalid value. The priority property must be one of the following strings: ${priorityLevelsText}.`,
      };
    }

    return { isValid: true, msg: "Todo priority contains valid data." };
  }

  validateTodoIsCompleted(todoIsCompleted) {
    if (todoIsCompleted === undefined) {
      return {
        isValid: false,
        msg: "{{methodName}} requires an isCompleted property. The isCompleted property must be a boolean value (true or false).",
      };
    }

    if (typeof todoIsCompleted !== "boolean") {
      return {
        isValid: false,
        msg: `{{methodName}} expects isCompleted to be a boolean, but received type ${typeof todoIsCompleted}. The isCompleted property must be a boolean value (true or false).`,
      };
    }

    return { isValid: true, msg: "Todo isCompleted contains valid data." };
  }

  validateTodo({ id, title, description, dueDate, priority, isCompleted }) {
    const validationResult = { isValid: false, msg: [] };

    function addErrorInValidationResult(validationErrorMsg) {
      validationResult.isValid = false;
      validationResult.msg.push(validationErrorMsg);
    }

    const todoIdValidationResult = this.validateTodoId(id);
    const todoTitleValidationResult = this.validateTodoTitle(title);
    const todoDescriptionValidationResult =
      this.validateTodoDescription(description);
    const todoDueDateValidationResult = this.validateTodoDueDate(dueDate);
    const todoPriorityValidationResult = this.validateTodoPriority(priority);
    const todoIsCompletedValidationResult =
      this.validateTodoIsCompleted(isCompleted);

    if (!todoTitleValidationResult.isValid) {
      addErrorInValidationResult(todoTitleValidationResult.msg);
    }

    if (!todoDescriptionValidationResult.isValid) {
      addErrorInValidationResult(todoDescriptionValidationResult.msg);
    }

    if (!todoDueDateValidationResult.isValid) {
      addErrorInValidationResult(todoDueDateValidationResult.msg);
    }

    if (!todoPriorityValidationResult.isValid) {
      addErrorInValidationResult(todoPriorityValidationResult.msg);
    }

    if (!todoIsCompletedValidationResult.isValid) {
      addErrorInValidationResult(todoIsCompletedValidationResult.msg);
    }

    if (
      todoIdValidationResult.isValid &&
      todoTitleValidationResult.isValid &&
      todoDescriptionValidationResult.isValid &&
      todoDueDateValidationResult.isValid &&
      todoPriorityValidationResult.isValid &&
      todoIsCompletedValidationResult.isValid
    ) {
      validationResult.isValid = true;
      validationResult.msg = ["Todo contains valid data."];
    }

    return validationResult;
  }
}

export class Todo {
  #id;
  #title;
  #description;
  #dueDate;
  #priority;
  #isCompleted;
  #validations;

  constructor(todoDetails) {
    validateObject(
      todoDetails,
      "Todo constructor expects a non-null object as input. Received: null.",
      "Todo constructor expects an object, but received an array. Provide an object with properties for the Todo item.",
      `Todo constructor expects an object, but received a primitive value of type ${typeof todoDetails}. Provide an object with properties for the Todo item.`
    );

    this.#validations = new TodoValidations();

    const defaultTodoDetails = {
      id: generateRandomId(),
      title: null,
      description: null,
      dueDate: null,
      priority: DEFAULT_TODO_PRIORITY.value,
      isCompleted: false,
    };
    const newTodoDetails = { ...defaultTodoDetails, ...todoDetails };

    const validationResult = this.#validations.validateTodo(newTodoDetails);
    if (!validationResult.isValid) {
      throw new Error(
        replacePlaceholders(validationResult.msg.join(" "), {
          methodName: "Todo constructor",
        })
      );
    }

    const { id, title, description, dueDate, priority, isCompleted } =
      newTodoDetails;

    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#isCompleted = isCompleted;
  }

  getTodo() {
    return JSON.parse(
      JSON.stringify({
        id: this.#id,
        title: this.#title,
        description: this.#description,
        dueDate: this.#dueDate,
        // dueDate: this.#dueDate.toISOString(),
        priority: this.#priority,
        isCompleted: this.#isCompleted,
      }),
      (key, value) => {
        if (key === "dueDate") {
          new Date(value);
          //   parseISO(value);
        }
        return value;
      }
    );
  }

  getTodoId() {
    return this.#id;
  }

  updateTodo(todoDetails) {
    validateObject(
      todoDetails,
      "updateTodo method expects a non-null object as input. Received: null.",
      "updateTodo method expects an object, but received an array. Provide an object with properties to update the Todo item.",
      `updateTodo method expects an object, but received a primitive value of type ${typeof todoDetails}. Provide an object with properties to update the Todo item.`
    );

    const currentTodoDetails = {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      dueDate: this.#dueDate,
      priority: this.#priority,
      isCompleted: this.#isCompleted,
    };
    const updatedTodoDetails = { ...currentTodoDetails, ...todoDetails };

    const validationResult = this.#validations.validateTodo(updatedTodoDetails);
    if (!validationResult.isValid) {
      throw new Error(
        replacePlaceholders(validationResult.msg.join(" "), {
          methodName: "updateTodo method",
        })
      );
    }

    const { title, description, dueDate, priority, isCompleted } =
      updatedTodoDetails;

    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#isCompleted = isCompleted;
  }

  toggleTodoCompleteStatus() {
    this.#isCompleted = !this.#isCompleted;
  }
}
