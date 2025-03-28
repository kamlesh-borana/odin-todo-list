import { Project } from "./project";
import { ProjectManager } from "./projectManager";
import { Todo } from "./todo";

export function createProjectManager() {
  const projectManager = new ProjectManager(Project, Todo);

  return projectManager;
}
