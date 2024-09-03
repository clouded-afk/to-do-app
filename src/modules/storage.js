import Task from "./task"
import List from "./list"
import ToDoList from "./todolist"

export default class Storage {
    saveToDo(data) {
        localStorage.setItem("toDo", JSON.stringify(data))
    }

    getToDoList() {
        const toDO = Object.assign(new ToDoList(), JSON.parse(localStorage.getItem("toDo")))

        toDO.setLists(toDO.getLists().map((list) => Object.assign(new List(), list)))

        toDO.getLists().forEach((list) => list.setTasks(list.getTasks().map((task) => Object.assign(new Task(), task))))

        return toDO
    }
}