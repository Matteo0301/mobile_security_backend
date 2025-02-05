"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.connect = connect;
exports.close = close;
exports.addUser = addUser;
exports.getUser = getUser;
exports.clear = clear;
exports.generateHash = generateHash;
exports.getTasks = getTasks;
exports.addTask = addTask;
exports.checkTask = checkTask;
exports.deleteTask = deleteTask;
exports.updateTask = updateTask;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const schemas_1 = require("./schemas");
let db;
function connect(CONNECTION_STRING) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, mongoose_1.set)("strictQuery", false);
        try {
            exports.db = db = yield (0, mongoose_1.connect)(CONNECTION_STRING);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    });
}
function clear() {
    return __awaiter(this, void 0, void 0, function* () {
        yield schemas_1.User.deleteMany({});
    });
}
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.disconnect();
    });
}
function generateHash(password) {
    let salt_rounds = 10;
    if (process.env.SALT_ROUNDS) {
        salt_rounds = parseInt(process.env.SALT_ROUNDS);
    }
    return bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(salt_rounds));
}
function addUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = generateHash(password);
        const user = yield getUser(username);
        if (user) {
            return false;
        }
        yield schemas_1.User.create({ username: username, password: hashedPassword });
        return true;
    });
}
function getUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield schemas_1.User.findOne({ username: username }).exec();
        //console.log(user)
        return user;
    });
}
function getTasks(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const tasks = yield schemas_1.Task.find({ userId: id }).exec();
        return tasks;
    });
}
function addTask(title, description, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        schemas_1.Task.create({ title: title, description: description, userId: userId, completed: false });
    });
}
function checkTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const task = yield schemas_1.Task.findOne({ _id: id }).exec();
        console.log(task);
        return task != null;
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield schemas_1.Task.deleteOne({ _id: id }).exec();
    });
}
function updateTask(id, completed) {
    return __awaiter(this, void 0, void 0, function* () {
        yield schemas_1.Task.updateOne({ _id: id }, { completed: completed });
    });
}
