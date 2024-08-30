import ToDoList from "./todolist";
import List from "./list";
import Task from "./task";

const toDo = new ToDoList();
let currentTask;

function addEventHandlers() {
    const headerText = document.querySelector(".content-header-text")
    const listDialog = document.querySelector(".list-dialog")
    const taskDialog = document.querySelector(".task-dialog")
    const editTaskDialog = document.querySelector(".edit-task-dialog")

    // For new task and new list buttons
    const newListButton = document.querySelector(".new-list-button")
    const newTaskButton = document.querySelector(".new-task-button")

    newListButton.addEventListener("click", () => {
        listDialog.style.display = "flex"
        taskDialog.style.display = "none"
        editTaskDialog.style.display = "none"
        clearListForm()
        buttonDisabler(true)
    })

    newTaskButton.addEventListener("click", () => {
        taskDialog.style.display = "flex"
        listDialog.style.display = "none"
        editTaskDialog.style.display = "none"
        clearTaskForm()
        buttonDisabler(true)
    })

    // for list form buttons
    const listSubmit = document.getElementById("list-submit")
    const listClose = document.querySelector(".list-close")

    listSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        addNewList()
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
        addNewTask()
        buttonDisabler(false)
    })

    taskClose.addEventListener("click", () => {
        taskDialog.style.display = "none"
        buttonDisabler(false)
    })

    // for edit-task form buttons
    const editTaskSave = document.querySelector(".task-save")
    const editTaskClose = document.querySelector(".close-edit-task")

    editTaskSave.addEventListener("click", () => {
        editTaskDialog.style.display = "none"
        buttonDisabler(false)
        saveEditedTask()
        renderTaskEdits()
        console.log(toDo.getLists())
    })

    editTaskClose.addEventListener("click", () => {
        editTaskDialog.style.display = "none"
        buttonDisabler(false)
    })

    //for my task buttons 
    const myTaskButton = document.querySelectorAll(".my-task-button")
    const contentLine = document.querySelector(".line-div-content")

    myTaskButton.forEach((button) => {
        button.addEventListener("click", () => {
            headerText.textContent = button.textContent
            newTaskButton.style.display = "none"
            contentLine.style.display = "block"
            removeActiveClass()
            button.classList.add("active")
            renderTasksForMyTasks()
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

    const listDelete = document.querySelectorAll(".list-delete")

    listDelete.forEach((button) => {
        button.disabled = disable
    })

    const taskDelete = document.querySelectorAll(".remove-task")
    const taskExpand = document.querySelectorAll(".expand-task")
    const taskEdit = document.querySelectorAll(".edit-task")

    taskDelete.forEach((button) => {
        button.disabled = disable
    })

    taskExpand.forEach((button) => {
        button.disabled = disable
    })

    taskEdit.forEach((button) => {
        button.disabled = disable
    })
}

// Validates list name so it is not empty and is unqiue
function validateListForm() {
    const listName = document.getElementById("list-name-input")
    const existingLists = toDo.getLists()
    const errorMessage = document.querySelector(".list-name-error")

    listName.addEventListener("input", function() {
        const trimmedValue = listName.value.trim()
        if (existingLists.includes(toDo.getList(trimmedValue))) {
            listName.style.border = "2px solid red"
            errorMessage.textContent = "Name Must Be Unique"
            errorMessage.style.display = "flex"
        } else if (trimmedValue === "") {
            listName.style.border = "2px solid red"
            errorMessage.textContent = "Name Must Not Be Empty"
            errorMessage.style.display = "flex"
        } else {
            listName.style.border = ""
            errorMessage.style.display = "none"
        }
    })
    
    listName.addEventListener("focus", function() {
        if (listName.style.border === "2px solid red") {
            this.style.outlineColor = "red"
        } else {
            this.style.outlineColor = "black"
        }
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
    const listDialog = document.querySelector(".list-dialog")

    // Validates list name so it is not empty and is unique, adds the new task if all conditions are satisfied in the validation function
    if (listName.value !== "" && !existingLists.includes(toDo.getList(listName.value))) {
        toDo.addList(new List(listName.value))
        listElement.appendChild(listButton)
        listElement.appendChild(delButton)
        myListSection.appendChild(listElement)
        listDialog.style.display = "none"
    } else {
        validateListForm()
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
    const deletedList = toDo.getList(listName)
    const listTasks = deletedList.getTasks()

    listTasks.forEach((task) => {
        const allTaskList = toDo.getList("All Tasks")
        const todayList = toDo.getList("Today")
        const thisWeekList = toDo.getList("This Week")

        if (allTaskList.contains(`${task.getName()} (${listName})`)) {
            removeTask("All Tasks", `${task.getName()} (${listName})`)
        }

        if (todayList.contains(`${task.getName()} (${listName})`)) {
            removeTask("Today", `${task.getName()} (${listName})`)
        }

        if (thisWeekList.contains(`${task.getName()} (${listName})`)) {
            removeTask("This Week", `${task.getName()} (${listName})`)
        }
    })

    toDo.deleteList(listName)
}

function validateTaskForm() {
    const headerText = document.querySelector(".content-header-text")

    const taskName = document.getElementById("task-name-input")
    const nameError = document.querySelector(".task-name-error")

    taskName.addEventListener("input", function() {
        const currentList = toDo.getList(headerText.textContent)
        const trimmedName = taskName.value.trim()
        if (trimmedName === "") {
            taskName.style.border = "2px solid red"
            nameError.textContent = "Name Must Not Be Empty"
            nameError.style.display = "block"
        } else if (currentList.contains(trimmedName)){
            taskName.style.border = "2px solid red"
            nameError.textContent = "Name Must Be Unique To This List"
            nameError.style.display = "block"
        } else {
            taskName.style.border = ""
            nameError.style.display = "none"
        }
    })

    const taskDescription = document.getElementById("task-description-input")
    const descError = document.querySelector(".task-desc-error")

    taskDescription.addEventListener("input", function() {
        const trimmedDesc = taskDescription.value.trim()
        if (trimmedDesc === "") {
            taskDescription.style.border = "2px solid red"
            descError.textContent = "Description Must Not Be Empty"
            descError.style.display = "block"
        } else {
            taskDescription.style.border = ""
            descError.style.display = "none"
        }
    })

    const taskDate = document.getElementById("task-due-date")
    const dateError = document.querySelector(".task-date-error")

    taskDate.addEventListener("input", function() {
        const selectedDate = new Date(taskDate.value)
        const today = new Date()
        const updatedDateSelection = selectedDate.setDate(selectedDate.getDate() + 1)

        if (!taskDate.value) {
            taskDate.style.border = "2px solid red"
            dateError.textContent = "You Must Select a Date"
            dateError.style.display = "block"
        } else if (updatedDateSelection < today){
            taskDate.style.border = "2px solid red"
            dateError.textContent = "You Must Select A Valid Date"
            dateError.style.display = "block"
        } else {
            taskDate.style.border = ""
            dateError.style.display = "none"
        }
    })
}

// Add task to the tasks array of the current list object selected | Pushes all newly created tasks to all task list
function addNewTask() {
    const taskName = document.getElementById("task-name-input")
    const taskDescription = document.getElementById("task-description-input")
    const taskDueDate = document.getElementById("task-due-date")
    const taskPriority =  document.getElementById("task-priority")

    const newTask = new Task(taskName.value, taskDescription.value, taskDueDate.value, taskPriority.value)

    const headerText = document.querySelector(".content-header-text")
    const currentList = toDo.getList(headerText.textContent)
    const taskDialog = document.querySelector(".task-dialog")

    const selectedDate = new Date(taskDueDate.value)
    const today = new Date()
    const updatedDateSelection = selectedDate.setDate(selectedDate.getDate() + 1)
    
    if (taskName.value !== "" && !currentList.contains(taskName.value) && taskDescription.value !== "" && taskDueDate.value && updatedDateSelection >= today) {
        currentList.addTask(newTask)
        toDo.addToAllTaskList()
        toDo.addToTodayList()
        toDo.addToThisWeekList()
        renderTasks()
        taskDialog.style.display = "none"
    } else {
        validateTaskForm()
    }
}

// Populate Edit Task form with correct data based on selected task to edit
function populateEditTaskForm(taskName) {
    const currentList = toDo.getList(document.querySelector(".content-header-text").textContent)
    const selectedTask = currentList.getTask(taskName)

    const editNameInput = document.getElementById("edit-task-name") 
    const editDescriptionInput = document.getElementById("edit-description")
    const editDueDateInput = document.getElementById("edit-due-date")
    const editPriorityInput = document.getElementById("edit-priority")

    editNameInput.value = selectedTask.getName()
    editDescriptionInput.value = selectedTask.getDescription()
    editDueDateInput.value = selectedTask.getDueDate()
    editPriorityInput.value = selectedTask.getPriority()

    currentTask = taskName
}

// Saves task after Edits
function saveEditedTask() {
    // For User Created Lists
    const currentList = toDo.getList(document.querySelector(".content-header-text").textContent)
    const selectedTask = currentList.getTask(currentTask)

    const editedName = document.getElementById("edit-task-name").value 
    const editedDescription = document.getElementById("edit-description").value
    const editedDueDate = document.getElementById("edit-due-date").value
    const editedPriority = document.getElementById("edit-priority").value

    selectedTask.setName(editedName)
    selectedTask.setDescription(editedDescription)
    selectedTask.setDueDate(editedDueDate)
    selectedTask.setPriority(editedPriority)

    // For All Tasks List
    const allTaskList = toDo.getList("All Tasks")
    const selectedAllTask = allTaskList.getTask(`${currentTask} (${currentList.getName()})`)

    selectedAllTask.setName(`${editedName} (${currentList.getName()})`)
    selectedAllTask.setDescription(editedDescription)
    selectedAllTask.setDueDate(editedDueDate)
    selectedAllTask.setPriority(editedPriority)

    // For Today List
    const todayList = toDo.getList("Today")
    const selectedTodayTask = todayList.getTask(`${currentTask} (${currentList.getName()})`)
    const todaysDate = new Date()
    
    if (todayList.contains(`${currentTask} (${currentList.getName()})`)) {
        if (editedDueDate !== todaysDate) {
            removeTask("Today", `${currentTask} (${currentList.getName()})`)
        } else {
            selectedTodayTask.setName(`${editedName} (${currentList.getName()})`)
            selectedTodayTask.setDescription(editedDescription)
            selectedTodayTask.setDueDate(editedDueDate)
            selectedTodayTask.setPriority(editedPriority)
        }
    } else {
        toDo.addToTodayList()
    }

    // For This Week List
    const thisWeekList = toDo.getList("This Week")
    const selectedThisWeekTask = thisWeekList.getTask(`${currentTask} (${currentList.getName()})`)

    const editedDate = new Date(editedDueDate)
    const startOfWeek = new Date(todaysDate.setDate(todaysDate.getDate() - todaysDate.getDay()))
    const endOfWeek = new Date(todaysDate.setDate(startOfWeek.getDate() + 6))

    if (editedDate >= startOfWeek && editedDate <= endOfWeek) {
        if (selectedThisWeekTask) {
            selectedThisWeekTask.setName(`${editedName} (${currentList.getName()})`)
            selectedThisWeekTask.setDescription(editedDescription)
            selectedThisWeekTask.setDueDate(editedDueDate)
            selectedThisWeekTask.setPriority(editedPriority)
        } else {
            toDo.addToThisWeekList()
        }
    } else {
        if (selectedThisWeekTask) {
            removeTask("This Week", `${currentTask} (${currentList.getName()})`)
        }
    }
}

// Removes the original task container, and replaces it with the edited version
function renderTaskEdits() {
    const taskContainers = document.querySelectorAll(".task-container") 

    taskContainers.forEach((task) => {
        task.remove()
    })

    renderTasks()
}

// Displays all tasks when all tasks button is clicked
function renderTasksForMyTasks() {
    const headerText = document.querySelector(".content-header-text")
    const taskContent = document.querySelector(".content")

    const selectedList = toDo.getList(headerText.textContent)
    const tasks = selectedList.getTasks()

    taskContent.innerHTML = ""

    tasks.forEach((task) => {
        const taskName = task.getName()
        const taskDescription = task.getDescription()
        const taskDate = task.getFormattedDate()
        const taskPriority = task.getPriority()

        const taskContainer = document.createElement("div")
        taskContainer.classList.add("task-container", `${taskPriority}`)
        
        taskContainer.innerHTML += `<div class="task-header">${taskName}</div> <div class="task-date"><strong>Due Date:</strong> ${taskDate}</div> <div class="task-description"><strong>Description:</strong><br> ${taskDescription}</div> <button class="expand-task myTask-expand"><i class="fa-solid fa-expand"></i></button>`

        taskContent.appendChild(taskContainer)

        const expandTaskButton = taskContainer.querySelector(".expand-task")
        const taskDescriptionDisplay = taskContainer.querySelector(".task-description")

        expandTaskButton.addEventListener("click", () => {
            const containerHeight = taskContainer.style.height
            const descriptionDisplay = taskDescriptionDisplay.style.display

            taskContainer.style.height = containerHeight === "200px" ? "90px" : "200px"

            taskDescriptionDisplay.style.display = descriptionDisplay === "block" ? "none" : "block"
        })
    })
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

        taskContainer.innerHTML += `<div class="task-header">${taskName}</div> <div class="task-date"><strong>Due Date:</strong> ${taskDate}</div> <div class="task-description"><strong>Description:</strong><br> ${taskDescription}</div> <div class="task-button-container"><button class="expand-task"><i class="fa-solid fa-expand"></i></button> <button class="remove-task"><i class="fa-solid fa-trash-can"></i></button></div> <button class="edit-task"><i class="fas fa-edit"></i></button>`

        taskContent.appendChild(taskContainer)

        const selectedTask = taskContainer.querySelector(".task-header").textContent

        // Removes task container, and task from its respective list
        const deleteTaskButton = taskContainer.querySelector(".remove-task");

        deleteTaskButton.addEventListener("click", () => {
            removeTask(headerText.textContent, selectedTask)
            removeTask("All Tasks", selectedTask)
            taskContainer.remove()
        })

        // For expand buttons
        const expandTaskButton = taskContainer.querySelector(".expand-task")
        const taskDescriptionDisplay = taskContainer.querySelector(".task-description")
        const editButton = taskContainer.querySelector(".edit-task")

        expandTaskButton.addEventListener("click", () => {
            const containerHeight = taskContainer.style.height
            const descriptionDisplay = taskDescriptionDisplay.style.display
            const editButtonDisplay = editButton.style.display

            taskContainer.style.height = containerHeight === "200px" ? "90px" : "200px"

            taskDescriptionDisplay.style.display = descriptionDisplay === "block" ? "none" : "block"

            editButton.style.display = editButtonDisplay === "block" ? "none" : "block"
        })

        // For edit task button
        const editTaskDialog = document.querySelector(".edit-task-dialog")

        editButton.addEventListener("click", () => {
            editTaskDialog.style.display = "flex"
            buttonDisabler(true)
            populateEditTaskForm(selectedTask)
        })
    })
}

// Removes task from the selected list
function removeTask(listName, taskName) {
    const selectedList = toDo.getList(listName)
    selectedList.deleteTask(taskName)

    const allTaskList = toDo.getList("All Tasks")
    allTaskList.deleteTask(`${taskName} (${listName})`)

    const todayList = toDo.getList("Today")
    todayList.deleteTask(`${taskName} (${listName})`)

    const thisWeekList = toDo.getList("This Week")
    thisWeekList.deleteTask(`${taskName} (${listName})`)

    console.log(toDo.getLists())
}

function clearListForm() {
    const listNameInput = document.getElementById("list-name-input")
    listNameInput.value = ""
    listNameInput.style.border = ""
    
    const errorMessage = document.querySelector(".list-name-error")
    errorMessage.style.display = "none"
}

function clearTaskForm() {
    const taskName = document.getElementById("task-name-input")
    const taskDescription = document.getElementById("task-description-input")
    const taskDueDate = document.getElementById("task-due-date")

    const nameError = document.querySelector(".task-name-error")
    const descError = document.querySelector(".task-desc-error")
    const dateError = document.querySelector(".task-date-error")

    taskName.value = ""
    taskName.style.border = ""
    nameError.style.display = "none"

    taskDescription.value = ""
    taskDescription.style.border = ""
    descError.style.display = "none"

    taskDueDate.value = ""
    taskDueDate.style.border = ""
    dateError.style.display = "none"
}

function initialLoad() {
    addEventHandlers()
    validateListForm()
    validateTaskForm()
}

export {
    initialLoad
}