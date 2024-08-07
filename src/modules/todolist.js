import List from "./list"

export default class ToDoList {
    constructor() {
        this.lists = []

        this.lists.push(new List("All Tasks"))
        this.lists.push(new List("Today"))
        this.lists.push(new List("This Week"))
    }
}