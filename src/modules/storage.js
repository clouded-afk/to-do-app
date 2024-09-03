import Task from "./task"
import List from "./list"
import ToDoList from "./todolist"

export default class Storage {
    saveToDo(data) {
        localStorage.setItem("toDo", JSON.stringify(data))
    }

    getToDo() {
        const toDo = Object.assign(new ToDoList(), JSON.parse(localStorage.getItem("toDo")))

        toDo.setLists(toDo.getLists().map((list) => Object.assign(new List(), list)))

        toDo.getLists().forEach((list) => list.setTasks(list.getTasks().map((task) => Object.assign(new Task(), task))))

        return toDo
    }

    addList(list) {
        const toDo = Storage.getToDo()
        toDo.addList(list)
        Storage.saveToDo(toDo)
    }

    deleteList(listName) {
        const toDo = Storage.getToDo()
        toDo.deleteList(listName)
        Storage.saveToDo(toDo)
    }

    addTask(listName, task) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).addTask(task)
        Storage.saveToDo(toDo)
    }

    deleteTask(listName, taskName) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).deleteTask(taskName)
        Storage.saveToDo(toDo)
    }

    renameTask(listName, taskName, newTaskName) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setName(newTaskName)
        Storage.saveToDo()
    }

    changeDescription(listName, taskName, newDescription) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setDescription(newDescription)
        Storage.saveToDo(toDo)
    }

    changeDueDate(listName, taskName, newDueDate) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setDueDate(newDueDate)
        Storage.saveToDo(toDo)
    }

    changePriority(listName, taskName, newTaskPriority) {
        const toDo = Storage.getToDo()
        toDo.getList(listName).getTask(taskName).setPriority(newTaskPriority)
        Storage.saveToDo(toDo)
    }
}