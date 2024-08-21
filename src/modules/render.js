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
        console.log(toDo.getLists())
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
        renderTasks();
        buttonDisabler(false)
    })

    taskClose.addEventListener("click", () => {
        taskDialog.style.display = "none"
        buttonDisabler(false)
    })

    //for my task buttons 
    const headerText = document.querySelector(".content-header-text")
    const myTaskButton = document.querySelectorAll(".my-task-button")
    const contentLine = document.querySelector(".line-div-content")

    myTaskButton.forEach((button) => {
        button.addEventListener("click", () => {
            headerText.textContent = button.textContent
            newTaskButton.style.display = "none"
            contentLine.style.display = "block"
            removeActiveClass()
            button.classList.add("active")
            renderTasks()
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
    listElement.classList.add("my-lists-selector")

    const listButton = document.createElement("button")
    listButton.classList.add("my-list-button")
    listButton.textContent = listName.value

    const delButton = document.createElement("button")
    delButton.classList.add("list-delete")
    delButton.innerHTML += `<i class="fa-solid fa-trash-can"></i>`

    const existingLists = toDo.getLists()

    if (existingLists.includes(toDo.getList(listName.value))) {
        alert("List name must be unique, Please enter a different name!")
        return
    } else {
        toDo.addList(new List(listName.value))
        listElement.appendChild(listButton)
        listElement.appendChild(delButton)
        myListSection.appendChild(listElement)
    }

    const headerText = document.querySelector(".content-header-text")
    const myListButton = document.querySelectorAll(".my-list-button")
    const newTaskButton = document.querySelector(".new-task-button")
    const contentLine = document.querySelector(".line-div-content")
    
    myListButton.forEach((button) => {
        button.addEventListener("click", () => {
            headerText.textContent = button.textContent
            newTaskButton.style.display = "block"
            contentLine.style.display = "block"
            removeActiveClass()
            renderTasks()
            button.classList.add("active")
        })
    })

    // Removes list from toDo object, and the element from the dom
    const taskContent = document.querySelector(".content")
    delButton.addEventListener("click", () => {
        listElement.remove();
        headerText.textContent = ""
        newTaskButton.style.display = "none"
        contentLine.style.display = "none"
        taskContent.innerHTML = ""
        removeList(listButton.textContent)
    });
}


// Removes list from lists array in toDo object
function removeList(listName) {
    toDo.deleteList(listName)
    console.log(toDo.getLists())
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

// gets the currentList and adds a a new task to it, then displays it on the screen, if selected a different list it will clear the content and show the content for that list
function renderTasks() {
    const taskContent = document.querySelector(".content")
    const headerText = document.querySelector(".content-header-text")

    const currentList =  toDo.getList(headerText.textContent)
    const currentTasks = currentList.getTasks()

    taskContent.innerHTML = ""

    currentTasks.forEach((task) => {
        const taskName = task.getName()
        const taskDescription = task.getDescription()
        const taskDate = task.getFormattedDate()
        const taskPriority = task.getPriority()

        const taskContainer = document.createElement("div")
        taskContainer.classList.add("task-container", `${taskPriority}`)

        taskContainer.innerHTML += `<div class="task-header">${taskName}</div> <div class="task-date"><strong>Due Date:</strong> ${taskDate}</div> <div class="task-description"><strong>Description:</strong> ${taskDescription}</div> <div class="task-button-container"><button class="expand-task"><i class="fa-solid fa-expand"></i></button> <button class="remove-task"><i class="fa-solid fa-trash-can"></i></button></div>`

        taskContent.appendChild(taskContainer)

        // Removes task container, and task from its respective list
        const deleteTaskButton = taskContainer.querySelector(".remove-task");

        deleteTaskButton.addEventListener("click", () => {
            const selectedTask = taskContainer.querySelector(".task-header").textContent
            removeTask(headerText.textContent, selectedTask)
            taskContainer.remove()
        })

        // For expand buttons
        const expandTasKButton = taskContainer.querySelector(".expand-task")
        const taskDescriptionDisplay = taskContainer.querySelector(".task-description")

        expandTasKButton.addEventListener("click", () => {
            const containerHeight = taskContainer.style.height
            const descriptionDisplay = taskDescriptionDisplay.style.display
            taskContainer.style.height = containerHeight === '150px' ? '75px' : '150px'
            taskDescriptionDisplay.style.display = descriptionDisplay === "block" ? "none" : "block"
        })
    })
}

// Removes task from the selected list
function removeTask(listName, taskName) {
    const selectedList = toDo.getList(listName)
    selectedList.deleteTask(taskName)
    console.log(toDo.getList(listName))
}

function initialLoad() {
    addEventHandlers()
}

export {
    initialLoad
}