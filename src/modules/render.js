import ToDoList from "./todolist";
import List from "./list";
import Task from "./task";

const toDo = new ToDoList();

function addEventHandlers() {
    const listDialog = document.querySelector(".list-dialog")
    const taskDialog = document.querySelector(".task-dialog")

    // For new task and new list buttons
    const newListButton = document.querySelector(".new-list-button")
    const newTaskButton = document.querySelector(".new-task-button")

    newListButton.addEventListener("click", () => {
        listDialog.style.display = "flex"
        taskDialog.style.display = "none"
    })

    newTaskButton.addEventListener("click", () => {
        taskDialog.style.display = "flex"
        listDialog.style.display = "none"
    })

    // for list form buttons
    const listSubmit = document.getElementById("list-submit")
    const listClose = document.querySelector(".list-close")

    listSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        listDialog.style.display = "none"
    })

    listClose.addEventListener("click", () => {
        listDialog.style.display = "none"
    })

    // for task form buttons
    const taskSubmit = document.getElementById("task-submit")
    const taskClose = document.querySelector(".task-close")

    taskSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        taskDialog.style.display = "none"
    })

    taskClose.addEventListener("click", () => {
        taskDialog.style.display = "none"
    })
}

function initialLoad() {
    addEventHandlers()
}

export {
    initialLoad
}