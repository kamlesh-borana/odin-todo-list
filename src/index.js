import { ProjectManager } from "./ProjectManager";
import "./styles/main.css";

console.log("Todo List");

const projectManager = new ProjectManager();

console.log(projectManager);

projectManager.addProject("Fitness");
projectManager.addTodo({ title: "Walk" });

