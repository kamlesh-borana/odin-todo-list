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

  return false;
}
