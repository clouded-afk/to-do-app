import Task from "./task"
import List from "./list"
import ToDoList from "./todolist"

export default class Storage {
    static saveToDo(data) {
        localStorage.setItem("toDo", JSON.stringify(data))
    }

    static getToDo() {
        
        const toDo = Object.assign(new ToDoList(), JSON.parse(localStorage.getItem("toDo")))
        toDo.setLists(toDo.getLists().map(list => Object.assign(new List(), list)))

        toDo.getLists().forEach(list => list.setTasks(list.getTasks().map(task => Object.assign(new Task(), task))))

        return toDo
    }

    static addList(list) {
        const toDo = Storage.getToDo()
        toDo.addList(list)
        Storage.saveToDo(toDo)
    }

    static deleteList(listName) {
        const toDo = Storage.getToDo()
        toDo.deleteList(listName)
        Storage.saveToDo(toDo)
    }

    static addTask(listName, task) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).addTask(task)
        Storage.saveToDo(toDo)
    }

    static deleteTask(listName, taskName) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).deleteTask(taskName)
        Storage.saveToDo(toDo)
    }

    static renameTask(listName, taskName, newTaskName) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setName(newTaskName)
        Storage.saveToDo(toDo)
    }

    static editDescription(listName, taskName, newDescription) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setDescription(newDescription)
        Storage.saveToDo(toDo)
    }

    static editDueDate(listName, taskName, newDueDate) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setDueDate(newDueDate)
        Storage.saveToDo(toDo)
    }

    static editPriority(listName, taskName, newTaskPriority) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setPriority(newTaskPriority)
        Storage.saveToDo(toDo)
    }

    static updateAllTasksList() {
        const toDo = Storage.getToDo()
        toDo.addToAllTaskList()
        Storage.saveToDo(toDo)
    }

    static updateTodayList() {
        const toDo = Storage.getToDo()
        toDo.addToTodayList()
        Storage.saveToDo(toDo)
    }

    static updateThisWeekList() {
        const toDo = Storage.getToDo()
        toDo.addToThisWeekList()
        Storage.saveToDo(toDo)
    }
}