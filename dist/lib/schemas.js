"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, index: true, unique: true },
    password: String,
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
});
const TaskSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    userId: String,
    completed: Boolean
});
const User = (0, mongoose_1.model)('User', UserSchema, 'users');
exports.User = User;
const Task = (0, mongoose_1.model)('Task', TaskSchema, 'tasks');
exports.Task = Task;
