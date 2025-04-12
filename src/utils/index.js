export function generateRandomId() {
  return crypto.randomUUID();
}

/**
 * Checks if a string is a valid UUID (Universally Unique Identifier).
 *
 * @param {string} uuidString - The string to check.
 * @returns {boolean} `true` if the string is a valid UUID, `false` otherwise.
 */
export function isValidId(uuidString) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuidString);
}

/**
 * Validates string format requirements
 * @param {string} string - The string to validate
 * @returns {boolean} True if string has content with proper spacing
 */
export function isValidString(string) {
  if (typeof string !== "string") {
    return false;
  }

  if (string.length === 0) {
    return false;
  }

  // Regex to validate:
  // 1. No leading, trailing whitespace
  // 2. No consecutive spaces
  // 3. Only space characters (no tabs/newlines, etc)
  // 4. At least one non-whitespace character
  return /^[^\s]+(?: [^\s]+)*$/.test(string);
}

/**
 * Replaces {{placeholder}} patterns in a string with values from an object
 * @param {string} templateString - String containing {{key}} placeholders
 * @param {Object} replacements - Key-value pairs for replacement
 * @returns {string} Formatted string with replacements applied
 */
export function replacePlaceholders(templateString, replacements) {
  if (typeof templateString !== "string") {
    throw new TypeError(
      `templateString must be a string (e.g. "Hello {{name}}"). Received: ${typeof templateString}.`
    );
  }

  if (replacements === null) {
    throw new TypeError(
      'replacements cannot be null. Use an object (e.g. {name: "Kamlesh"}).'
    );
  }
  if (Array.isArray(replacements)) {
    throw new TypeError(
      "replacements must be an object, not an array. Use {key: value} format."
    );
  }
  if (typeof replacements !== "object") {
    throw new TypeError(
      `replacements must be an object. Received: ${typeof replacements}.`
    );
  }

  // Regex: Matches any {{placeholder}} pattern (e.g., {{name}}, {{age}})
  return templateString.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in replacements ? replacements[key] : match
  );
}

export function isValidObject(value) {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    return false;
  }

  return true;
}

/**
 * Creates a DOM element with the specified tag name, ID, classes, and attributes.
 *
 * @param {string} tagName The tag name for the element. Must be a non-empty string.
 * @param {string} [id] The ID for the element. Must be a string if provided.
 * @param {string | string[]} [classes] A string or array of strings for the element's classes.
 * @param {object} [attributes] An object containing attributes to set on the element.
 *                             The keys are the attribute names, and the values are the
 *                             attribute values.
 *
 * @returns {HTMLElement} The created DOM element.
 *
 * @throws {TypeError} If `tagName` is not a string, `id` is not a string, `classes`
 *                     is not a string or an array of strings, or `attributes` is not an object.
 * @throws {Error} If `tagName` is an empty string.
 */
export function createElement(tagName, id, classes, attributes) {
  if (typeof tagName !== "string") {
    throw new TypeError(
      `createElement method expects a non-empty string as input for the tagName parameter. Received: ${typeof tagName}.`
    );
  }
  if (typeof tagName === "string" && !tagName.trim()) {
    throw new Error(
      "createElement method expects a non-empty string as input for the tagName parameter instead received an empty string."
    );
  }

  if (id !== undefined && typeof id !== "string") {
    throw new TypeError(
      `createElement method expects a string as an input for the id parameter. Received: ${typeof id}.`
    );
  }

  if (classes !== undefined) {
    if (!(typeof classes === "string") && !Array.isArray(classes)) {
      throw new TypeError(
        `createElement method expects a string or an array of string as an input for the classes parameter. Received: ${typeof classes}.`
      );
    }
    if (
      Array.isArray(classes) &&
      classes.some((className) => typeof className !== "string")
    ) {
      throw new TypeError(
        `createElement method expects a string or an array of string as an input for the classes parameter. Received an array containing non-string values.`
      );
    }
  }

  if (attributes !== undefined && !isValidObject(attributes)) {
    throw new TypeError(
      `createElement method expects an object as an input for the attributes parameter. Received: ${typeof attributes}.`
    );
  }

  const createdElement = document.createElement(tagName);

  if (id) {
    createdElement.id = id;
  }

  if (classes) {
    if (typeof classes === "string") {
      createdElement.classList.add(classes.trim());
    } else {
      if (Array.isArray(classes)) {
        createdElement.classList.add(...classes);
      }
    }
  }

  if (attributes) {
    for (const attribute in attributes) {
      if (Object.hasOwn(attributes, attribute)) {
        createdElement.setAttribute(attribute, attributes[attribute]);
      }
    }
  }

  return createdElement;
}
