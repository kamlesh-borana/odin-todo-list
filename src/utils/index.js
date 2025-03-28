import { PRIORITIES } from "./constants";

export function isValidPriority(priority) {
  const validPriorities = Object.values(PRIORITIES);
  return validPriorities.includes(priority);
}

export function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
