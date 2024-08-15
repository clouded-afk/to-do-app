import List from "./list"

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
}