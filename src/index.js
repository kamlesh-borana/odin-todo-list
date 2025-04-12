// import { ProjectManager } from "./ProjectManager";
import "./styles/main.css";
import { UIControls } from "./UIControls";

console.log("Todo List");

// const projectManager = new ProjectManager();

// console.log(projectManager);

const uiControls = new UIControls();

// uiControls.renderActionList();
// uiControls.renderMyProjectsList();
// uiControls.renderMainView();

uiControls.renderApp();

// Check if passed it and title/name exist in the same todo/project
