export default class Task {
    constructor(name, description, dueDate, priority) {
        this.name = name
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }

    setName(name) {
        this.name
    }

    getName() {
        return this.name
    }

    setDescription(description) {
        this.description
    }

    getDescription() {
        return this.description
    }

    setDueDate(dueDate) {
        this.dueDate
    }

    getDueDate() {
        return this.dueDate
    }

    setPriority(priority) {
        this.priority
    }

    getPriority() {
        return this.priority
    }
    
}