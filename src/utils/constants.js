export const PRIORITIES_MAP = {
  URGENT: { value: "p0", label: "Urgent" },
  HIGH: { value: "p1", label: "High" },
  MEDIUM: { value: "p2", label: "Medium" },
  LOW: { value: "p3", label: "Low" },
};

export const PRIORITIES = Object.values(PRIORITIES_MAP);

export const DEFAULT_TODO_PRIORITY = PRIORITIES_MAP.LOW;

export const DEFAULT_PROJECT_NAME = "Inbox";

export const MINIMUM_TODO_TITLE_CHARACTER_LENGTH = 1;

export const MINIMUM_PROJECT_NAME_CHARACTER_LENGTH = 1;
