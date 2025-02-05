import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, index: true, unique: true },
    password: String,
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
})

const TaskSchema = new Schema({
    title: String,
    description: String,
    userId: String,
    completed: Boolean
})

const User = model('User', UserSchema, 'users')
const Task = model('Task', TaskSchema, 'tasks')

export { User, Task }