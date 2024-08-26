import { toDate, isToday, isThisWeek, subDays, sub } from "date-fns"

export default class List {
    constructor(name) {
        this.name = name
        this.tasks = []
    } 

    setName(name) {
        this.name = name
    }

    getName() {
        return this.name
    }

    setTasks(tasks) {
        this.tasks = tasks
    }

    getTasks() {
        return this.tasks
    }

    getTask(taskName) {
        return this.tasks.find((task) => task.getName() === taskName)
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.getName() === newTask)) {
            return
        }
        this.tasks.push(newTask)
    }

    deleteTask(taskName) {
        this.tasks = this.tasks.filter((task) => task.name !== taskName)
    }

    getTodayTasks() {
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getFormattedDate())
            return isToday(toDate(taskDate))
        })
    }

    getThisWeeksTasks() {
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getFormattedDate())
            return isThisWeek(subDays(toDate(taskDate), 1))
        })
    }
}