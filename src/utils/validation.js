/**
 * Validates if the input is a string; throws TypeError if not.
 *
 * @param {any} input - The value to validate.
 * @param {string} [errorMessage] - Optional error message for the TypeError.
 * @returns {string} The validated string.
 * @throws {TypeError} If the input is not a string or if errorMessage is not a string.
 */
export function validateString(input, errorMessage) {
  if (errorMessage !== undefined && typeof errorMessage !== "string") {
    throw new TypeError("errorMessage must be a string.");
  }

  if (typeof input !== "string") {
    throw new TypeError(errorMessage || "Input must be a string.");
  }

  return input;
}

/**
 * Validates that the passed input is an object.
 * Throws a TypeError with a specific message for null, arrays, and other non-object types.
 *
 * @param {any} input - The input to validate.
 * @param {string} [nullErrorMessage] - Optional error message for null input.
 * @param {string} [arrayErrorMessage] - Optional error message for array input.
 * @param {string} [typeErrorMessage] - Optional error message for other non-object types.
 * @returns {object} The validated object.
 * @throws {TypeError} Throws a TypeError if:
 *   - The input is null, an array, or not an object.
 *   - The error message parameters are not strings.
 */
export function validateObject(
  input,
  nullErrorMessage,
  arrayErrorMessage,
  typeErrorMessage
) {
  if (nullErrorMessage !== undefined && typeof nullErrorMessage !== "string") {
    throw new TypeError("nullErrorMessage must be a string.");
  }
  if (
    arrayErrorMessage !== undefined &&
    typeof arrayErrorMessage !== "string"
  ) {
    throw new TypeError("arrayErrorMessage must be a string.");
  }
  if (typeErrorMessage !== undefined && typeof typeErrorMessage !== "string") {
    throw new TypeError("typeErrorMessage must be a string.");
  }

  if (input === null) {
    throw new TypeError(
      nullErrorMessage ||
        "Input cannot be null. Please provide a valid object (e.g., {key: value})."
    );
  }
  if (Array.isArray(input)) {
    throw new TypeError(
      arrayErrorMessage ||
        "Input must be an object, not an array. Use {key: value} format."
    );
  }
  if (typeof input !== "object") {
    throw new TypeError(
      typeErrorMessage || `Input must be an object. Received: ${typeof input}.`
    );
  }

  return input;
}
