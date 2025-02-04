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
exports.User = exports.db = void 0;
exports.connect = connect;
exports.close = close;
exports.addUser = addUser;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.clear = clear;
exports.generateHash = generateHash;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const schemas_1 = require("./schemas");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return schemas_1.User; } });
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
function addUser(username, password, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = generateHash(password);
        const user = yield getUser(username);
        if (user) {
            return false;
        }
        yield schemas_1.User.create({ username: username, password: hashedPassword, admin: admin });
        return true;
    });
}
function getUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield schemas_1.User.findOne().exec();
        console.log(user);
        return user;
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const u = yield schemas_1.User.find().exec();
        let users = [];
        u.forEach((user) => {
            users.push({ username: user.username, admin: user.admin });
        });
        return users;
    });
}
function updateUser(username, newName, password, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = generateHash(password);
        yield schemas_1.User.updateOne({ username: { $eq: username } }, { $set: { username: newName, password: hashedPassword, admin: admin } });
    });
}
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function* () {
        yield schemas_1.User.deleteOne({ username: { $eq: username } });
    });
}
