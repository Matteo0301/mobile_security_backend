import { set, connect as db_connect, Types, mongo } from "mongoose"
import bcrypt from 'bcrypt'
import { Task, User } from "./schemas"

let db: any

async function connect(CONNECTION_STRING: string) {
    set("strictQuery", false)
    try {
        db = await db_connect(CONNECTION_STRING)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

async function clear() {
    await User.deleteMany({})
}

async function close() {
    await db.disconnect()
}

function generateHash(password: string): string {
    let salt_rounds = 10
    if (process.env.SALT_ROUNDS) {
        salt_rounds = parseInt(process.env.SALT_ROUNDS)
    }
    return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_rounds))
}

async function addUser(username: string, password: string) {
    const hashedPassword = generateHash(password)
    const user = await getUser(username)
    if (user) {
        return false
    }
    await User.create({ username: username, password: hashedPassword })
    return true
}

async function getUser(username: string) {
    const user = await User.findOne({ username: username }).exec()
    //console.log(user)
    return user
}


async function getTasks(id: string) {
    const tasks = await Task.find({ userId: id }).exec()
    return tasks
}

async function addTask(title: string, description: string, userId: string) {
    Task.create({ title: title, description: description, userId: userId, completed: false })
}

async function checkTask(id: string) {
    const task = await Task.findOne({ _id: id }).exec()
    console.log(task)
    return task != null
}

async function deleteTask(id: string) {
    await Task.deleteOne({ _id: id }).exec()
}

async function updateTask(id: string, completed: boolean) {
    await Task.updateOne({ _id: id }, { completed: completed })
}

export { connect, close, db, addUser, getUser, clear, generateHash, getTasks, addTask, checkTask, deleteTask, updateTask }