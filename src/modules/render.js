import ToDoList from "./todolist";
import List from "./list";
import Task from "./task";
import Storage from "./storage";

const toDo = Storage.getToDo();
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
        buttonDisabler(false)
        saveEditedTask()
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
            renderTasksForGeneralLists()
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

function loadStoredLists() {
    toDo.getLists().forEach((list) => {
        if (list.name !== "All Tasks" && list.name !== "Today" && list.name !== "This Week") {
            renderStoredLists(list.name)
        }
    })
}

// Validates list name so it is not empty and is unqiue
function validateListForm() {
    const listName = document.getElementById("list-name-input")
    const errorMessage = document.querySelector(".list-name-error")

    listName.addEventListener("input", function() {
        const trimmedValue = listName.value.trim()
        if (Storage.getToDo().getList(trimmedValue)) {
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

    const submitButton = document.getElementById("list-submit") 
    submitButton.addEventListener("click", (event) => {
        event.preventDefault()
        const trimmedValue = listName.value.trim()
        if (trimmedValue === "") {
            listName.style.border = "2px solid red"
            errorMessage.textContent = "Name Must Not Be Empty"
            errorMessage.style.display = "flex"
        } else if (Storage.getToDo().getList(trimmedValue)){
            listName.style.border = "2px solid red"
            errorMessage.textContent = "Name Must Be Unique"
            errorMessage.style.display = "flex"
        }
    })
}

// Removes list from lists array in toDo object
function removeList(listName) {
    const deletedList = Storage.getToDo().getList(listName)
    const listTasks = deletedList.getTasks()

    listTasks.forEach((task) => {
        const allTaskList = Storage.getToDo().getList("All Tasks")
        const todayList = Storage.getToDo().getList("Today")
        const thisWeekList = Storage.getToDo().getList("This Week")

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

    Storage.deleteList(listName)
    console.log(Storage.getToDo().getLists())
}

function renderStoredLists(listName) {
    const myListSection = document.querySelector(".my-lists")
    const inputListName = listName

    const listElement = document.createElement("li")
    listElement.classList.add("my-lists-selector")

    const listButton = document.createElement("button")
    listButton.classList.add("my-list-button")
    listButton.textContent = inputListName

    const delButton = document.createElement("button")
    delButton.classList.add("list-delete")
    delButton.innerHTML += `<i class="fa-solid fa-trash-can"></i>`

    listElement.appendChild(listButton)
    listElement.appendChild(delButton)
    myListSection.appendChild(listElement)

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
            button.classList.add("active")
            renderTasks()
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
    if (listName.value !== "" && !Storage.getToDo().getList(listName.value)) {
        Storage.addList(new List(listName.value))
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

function validateTaskForm() {
    const headerText = document.querySelector(".content-header-text")

    const taskName = document.getElementById("task-name-input")
    const nameError = document.querySelector(".task-name-error")

    taskName.addEventListener("input", function() {
        const currentList = Storage.getToDo().getList(headerText.textContent)
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
        today.setHours(0,0,0,0)

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

    const submitButton = document.getElementById("task-submit")

    submitButton.addEventListener("click", (event) => {
        event.preventDefault()
        const trimmedName = taskName.value.trim()
        const trimmedDesc = taskDescription.value.trim()
        if (trimmedName === "") {
            taskName.style.border = "2px solid red"
            nameError.textContent = "Name Must Not Be Empty"
            nameError.style.display = "block"
        } 
        if (trimmedDesc === "") {
            taskDescription.style.border = "2px solid red"
            descError.textContent = "Description Must Not Be Empty"
            descError.style.display = "block"
        }
        if (!taskDate.value) {
            taskDate.style.border = "2px solid red"
            dateError.textContent = "You Must Select a Date"
            dateError.style.display = "block"
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
    const currentList = Storage.getToDo().getList(headerText.textContent)
    const taskDialog = document.querySelector(".task-dialog")

    const selectedDate = new Date(taskDueDate.value)
    const today = new Date()
    const updatedDateSelection = selectedDate.setDate(selectedDate.getDate() + 1)
    today.setHours(0,0,0,0)
    
    if (taskName.value !== "" && !currentList.contains(taskName.value) && taskDescription.value !== "" && taskDueDate.value && updatedDateSelection >= today) {
        Storage.addTask(headerText.textContent, newTask)
        Storage.updateAllTasksList()
        Storage.updateThisWeekList()
        Storage.updateTodayList()
        renderTasks()
        taskDialog.style.display = "none"
    } else {
        validateTaskForm()
    }
}

// Populate Edit Task form with correct data based on selected task to edit
function populateEditTaskForm(taskName) {
    const currentList = Storage.getToDo().getList(document.querySelector(".content-header-text").textContent)
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

function validateEditTaskForm() {
    const headerText = document.querySelector(".content-header-text")
    const editedName = document.getElementById("edit-task-name") 
    const editedNameError = document.querySelector(".edit-name-error")

    editedName.addEventListener("input", function() {
        const currentList = Storage.getToDo().getList(headerText.textContent)
        const trimmedEditedName = editedName.value.trim()
        const currentTaskName = currentTask

        if (trimmedEditedName === "") {
            editedName.style.border = "2px solid red"
            editedNameError.textContent = "Name Must Not Be Empty"
            editedNameError.style.display = "block"
        } else if (currentList.contains(trimmedEditedName) && trimmedEditedName !== currentTaskName) {
            editedName.style.border = "2px solid red"
            editedNameError.textContent = "Name Must Be Unique Within This List"
            editedNameError.style.display = "block"
        } else {
            editedName.style.border = ""
            editedNameError.style.display = "none"
        }
    })

    const editedDescription = document.getElementById("edit-description")
    const editedDescError = document.querySelector(".edit-desc-error")

    editedDescription.addEventListener("input", function() {
        const trimmedEditedDesc = editedDescription.value.trim()

        if (trimmedEditedDesc === "") {
            editedDescription.style.border = "2px solid red"
            editedDescError.textContent = "Description Must Not Be Empty"
            editedDescError.style.display = "block"
        } else {
            editedDescription.style.border = ""
            editedDescError.style.display = "none"
        }
    })

    const editedDueDate = document.getElementById("edit-due-date")
    const editedDateError = document.querySelector(".edit-date-error")

    editedDueDate.addEventListener("input", function() {
        const selectedDate = new Date(editedDueDate.value)
        const today = new Date()
        const updatedDateSelection = selectedDate.setDate(selectedDate.getDate() + 1)
        today.setHours(0,0,0,0)

        if (!editedDueDate.value) {
            editedDueDate.style.border = "2px solid red"
            editedDateError.textContent = "You Must Select A Date"
            editedDateError.style.display = "block"
        } else if (updatedDateSelection < today) {
            editedDueDate.style.border = "2px solid red"
            editedDateError.textContent = "You Must Select A Valid Date"
            editedDateError.style.display = "block"
        } else {
            editedDueDate.style.border = ""
            editedDateError.style.display = "none"
        }
    })
}

// Saves task after Edits
function saveEditedTask() {
    // For User Created Lists
    const currentList = Storage.getToDo().getList(document.querySelector(".content-header-text").textContent).getName()

    const editedName = document.getElementById("edit-task-name").value 
    const editedDescription = document.getElementById("edit-description").value
    const editedDueDate = document.getElementById("edit-due-date").value
    const editedPriority = document.getElementById("edit-priority").value

    const editTaskDialog = document.querySelector(".edit-task-dialog")

    const selectedDate = new Date(editedDueDate)
    const today = new Date()
    const updatedDateSelection = selectedDate.setDate(selectedDate.getDate() + 1)
    today.setHours(0,0,0,0)
    selectedDate.setHours(0,0,0,0)


    if (editedName !== "" && (editedName === currentTask || !Storage.getToDo().getList(currentList).contains(editedName)) && editedDescription !== "" && updatedDateSelection >= today) {
        Storage.editDescription(currentList, currentTask, editedDescription)
        Storage.editDueDate(currentList, currentTask, editedDueDate)
        Storage.editPriority(currentList, currentTask, editedPriority)
        Storage.renameTask(currentList, currentTask, editedName)


        editTaskDialog.style.display = "none"
        renderTaskEdits()

        // For All Tasks List
        Storage.editDescription("All Tasks", `${currentTask} (${currentList})`, editedDescription)
        Storage.editDueDate("All Tasks", `${currentTask} (${currentList})`, editedDueDate)
        Storage.editPriority("All Tasks", `${currentTask} (${currentList})`, editedPriority)
        Storage.renameTask("All Tasks", `${currentTask} (${currentList})`, `${editedName} (${currentList})`)

        // For Today List
        const todayList = Storage.getToDo().getList("Today")
        
        if (todayList.contains(`${currentTask} (${currentList})`)) {
            if (selectedDate.getTime() !== today.getTime()) {
                removeTask("Today", `${currentTask} (${currentList})`)
            } else {
                Storage.editDescription("Today", `${currentTask} (${currentList})`, editedDescription)
                Storage.editDueDate("Today", `${currentTask} (${currentList})`, editedDueDate)
                Storage.editPriority("Today", `${currentTask} (${currentList})`, editedPriority)
                Storage.renameTask("Today", `${currentTask} (${currentList})`, `${editedName} (${currentList})`)
            }
        } else if (!todayList.contains(`${currentTask} (${currentList})`) && selectedDate.getTime() === today.getTime()){
            Storage.addTask("Today", new Task(`${currentTask} (${currentList})`, editedDescription, editedDueDate, editedPriority))
        }   

        // For This Week List
        const thisWeekList = Storage.getToDo().getList("This Week")
        const selectedThisWeekTask = thisWeekList.getTask(`${currentTask} (${currentList})`)

        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6))

        if (selectedDate >= startOfWeek && selectedDate <= endOfWeek) {
            if (thisWeekList.contains(`${currentTask} (${currentList})`)) {
                Storage.editDescription("This Week", `${currentTask} (${currentList})`, editedDescription)
                Storage.editDueDate("This Week", `${currentTask} (${currentList})`, editedDueDate)
                Storage.editPriority("This Week", `${currentTask} (${currentList})`, editedPriority)
                Storage.renameTask("This Week", `${currentTask} (${currentList})`, `${editedName} (${currentList})`)
            } else {
                Storage.addTask("This Week", new Task(`${currentTask} (${currentList})`, editedDescription, editedDueDate, editedPriority))
            }
        } else {
            if (selectedThisWeekTask) {
                removeTask("This Week", `${currentTask} (${currentList})`)
            }
        }

        Storage.updateAllTasksList()
        Storage.updateThisWeekList()
    } else {
        validateEditTaskForm()
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
function renderTasksForGeneralLists() {
    const headerText = document.querySelector(".content-header-text")
    const taskContent = document.querySelector(".content")

    const selectedList = Storage.getToDo().getList(headerText.textContent)
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

    const currentList =  Storage.getToDo().getList(headerText.textContent)
    console.log(currentList)
    const currentTasks = currentList.getTasks()

    currentTasks.sort((a, b) => new Date(a.getFormattedDate()) - new Date(b.getFormattedDate()));

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
            removeTask(headerText.textContent, taskName)
            removeTask("All Tasks", taskName)
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
            clearEditTaskForm()
        })
    })
}

// Removes task from the selected list
function removeTask(listName, taskName) {
    Storage.deleteTask(listName, taskName)

    Storage.deleteTask("All Tasks", `${taskName} (${listName})`)

    Storage.deleteTask("Today", `${taskName} (${listName})`)

    Storage.deleteTask("This Week", `${taskName} (${listName})`)

    console.log(Storage.getToDo().getLists())
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

function clearEditTaskForm() {
    const editedName = document.getElementById("edit-task-name") 
    const editedDescription = document.getElementById("edit-description")
    const editedDueDate = document.getElementById("edit-due-date")

    const nameError = document.querySelector(".edit-name-error")
    const descError = document.querySelector(".edit-desc-error")
    const dateError = document.querySelector(".edit-date-error")

    editedName.style.border = ""
    nameError.style.display = "none"

    editedDescription.style.border = ""
    descError.style.display = "none"

    editedDueDate.style.border = ""
    dateError.style.display = "none"
}

function initialLoad() {
    addEventHandlers()
    validateListForm()
    validateTaskForm()
    validateEditTaskForm()
    loadStoredLists()
    renderTasksForGeneralLists()

    window.onload = function() {
        if (!localStorage.getItem("toDo")) {
            Storage.saveToDo(new ToDoList())
        }
    }
}

export {
    initialLoad
}