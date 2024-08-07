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
        buttonDisabler(true)
    })

    newTaskButton.addEventListener("click", () => {
        taskDialog.style.display = "flex"
        listDialog.style.display = "none"
        buttonDisabler(true)
    })

    // for list form buttons
    const listSubmit = document.getElementById("list-submit")
    const listClose = document.querySelector(".list-close")

    listSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        listDialog.style.display = "none"
        addNewList();
        buttonDisabler(false)
    })

    listClose.addEventListener("click", () => {
        listDialog.style.display = "none"
        buttonDisabler(false)
    })

    // for task form buttons
    const taskSubmit = document.getElementById("task-submit")
    const taskClose = document.querySelector(".task-close")

    taskSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        taskDialog.style.display = "none"
        addNewTask();
        buttonDisabler(false)
    })

    taskClose.addEventListener("click", () => {
        taskDialog.style.display = "none"
        buttonDisabler(false)
    })

    //for my task buttons 
    const headerText = document.querySelector(".content-header-text")
    const myTaskButton = document.querySelectorAll(".my-task-button")

    myTaskButton.forEach((button) => {
        button.addEventListener("click", () => {
            headerText.textContent = button.textContent
            newTaskButton.style.display = "none"
            removeActiveClass()
            button.classList.add("active")
        })
    })
}

// disables other buttons while a dialog is open
function buttonDisabler(disable) {
    const myListButton = document.querySelectorAll(".my-list-button")
    const myTaskButton = document.querySelectorAll(".my-task-button")

    myListButton.forEach((button) => {
        button.disabled = disable
    })

    myTaskButton.forEach((button) => {
        button.disabled = disable
    })
}

// adds list button to the page and pushes that list into the lists array of the ToDoList object
function addNewList() {
    const myListSection = document.querySelector(".my-lists")
    const listName = document.getElementById("list-name-input")
    
    const listElement = document.createElement("li")
    const listButton = document.createElement("button")

    listButton.classList.add("my-list-button")
    listButton.textContent = listName.value

    toDo.addList(new List(listName.value))
    listElement.appendChild(listButton)
    myListSection.appendChild(listElement)

    const headerText = document.querySelector(".content-header-text")
    const myListButton = document.querySelectorAll(".my-list-button")
    const newTaskButton = document.querySelector(".new-task-button")
    
    myListButton.forEach((button) => {
        button.addEventListener("click", () => {
            headerText.textContent = button.textContent
            newTaskButton.style.display = "block"
            removeActiveClass()
            button.classList.add("active")
        })
    })
}

// Add task to the tasks array of the current list object selected
function addNewTask() {
    const taskName = document.getElementById("task-name-input")
    const taskDescription = document.getElementById("task-description-input")
    const taskDueDate = document.getElementById("task-due-date")
    const taskPriority =  document.getElementById("task-priority")

    const newTask = new Task(taskName.value, taskDescription.value, taskDueDate.value, taskPriority.value)

    const headerText = document.querySelector(".content-header-text")

    const currentList = toDo.getList(headerText.textContent)
    currentList.addTask(newTask)
}

//remove active class when from buttons when a different button is clicked
function removeActiveClass() {
    const myTaskButton = document.querySelectorAll(".my-task-button")
    const myListButton = document.querySelectorAll(".my-list-button")

    myTaskButton.forEach((button) => {
        button.classList.remove("active")
    })

    myListButton.forEach((button) => {
        button.classList.remove("active")
    })
}



function initialLoad() {
    addEventHandlers()
}

export {
    initialLoad
}