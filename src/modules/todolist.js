import { compareAsc, toDate } from "date-fns"
import List from "./list"
import Task from "./task"

export default class ToDoList {
    constructor() {
        this.lists = []

        this.lists.push(new List("All Tasks"))
        this.lists.push(new List("Today"))
        this.lists.push(new List("This Week"))
    }

    setLists(lists) {
        this.lists = lists
    }

    getLists() {
        return this.lists
    }

    getList(listName) {
        return this.lists.find((list) => list.getName() === listName)
    }

    addList(newList) {
        if (this.lists.find((list) => list.name === newList.name)) {
            return
        }
        this.lists.push(newList)
    }

    deleteList(listName) {
        const listToDelete = this.lists.find((list) => list.getName() === listName)

        this.lists.splice(this.lists.indexOf(listToDelete), 1)
    }

    addToTodayList() {
        this.getList("Today").tasks = []

        this.lists.forEach((list) => {
            if (list.getName() === "Today" || list.getName() === "This Week") {
                return
            }

            const todayTasks = list.getTodayTasks()

            todayTasks.forEach((task) => {
                const taskName =`${task.getName()} (${list.getName()})`
                this.getList("Today").addTask(new Task(taskName, task.getDescription(), task.getDueDate(), task.getPriority()))
            })
        })
    }

    addToThisWeekList() {
        this.getList("This Week").tasks = []

        this.lists.forEach((list) => {
            if (list.getName() === "Today" || list.getName() === "This Week") {
                return
            }

            const thisWeeksTasks = list.getThisWeeksTasks()

            thisWeeksTasks.forEach((task) => {
                const taskName = `${task.getName()} (${list.getName()})`
                this.getList("This Week").addTask(new Task(taskName, task.getDescription(), task.getDueDate(), task.getPriority()))
            })
        })

        this.getList("This Week").setTasks(this.getList("This Week").getTasks().sort((taskOne, taskTwo) => compareAsc(toDate(new Date(taskOne.getFormattedDate())), toDate(new Date(taskTwo.getFormattedDate())))))
    }
}