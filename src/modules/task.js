export default class Task {
    constructor(name, description, dueDate, priority) {
        this.name = name
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
    }

    setName(name) {
        this.name = name
    }

    getName() {
        return this.name
    }

    setDescription(description) {
        this.description = description
    }

    getDescription() {
        return this.description
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate
    }

    getDueDate() {
        return this.dueDate
    }

    getFormattedDate() {
        const month = this.dueDate.split('-')[1]
        const day = this.dueDate.split('-')[2]
        const year = this.dueDate.split('-')[0]

        return `${month}-${day}-${year}`
    }

    setPriority(priority) {
        this.priority = priority
    }

    getPriority() {
        return this.priority
    }    
}