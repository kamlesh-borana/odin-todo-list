import { createProjectManager } from "./createProjectManager";

const projectManager = createProjectManager();

window.todo = projectManager;

console.log(window.todo);
