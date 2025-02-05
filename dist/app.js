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
const auth_js_1 = require("./lib/auth.js");
const token_1 = require("./lib/token");
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const mongoose_1 = require("./lib/mongoose");
const express_validator_1 = require("express-validator");
const body_parser_1 = __importDefault(require("body-parser"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const conection_string = process.env.CONNECTION_STRING || '';
app.use(body_parser_1.default.urlencoded({
    extended: false
}));
app.use(body_parser_1.default.json());
//app.get("/", (req, res) => res.type('html').send(html));
function checkValidationErrors(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            res.status(400).send();
        }
        else {
            next();
        }
    });
}
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
        yield (0, mongoose_1.connect)(conection_string);
        const random_secret = (0, crypto_1.randomBytes)(64).toString('hex');
        let secret = process.env.TOKEN_SECRET || random_secret;
        (0, token_1.setSecret)(secret);
        console.log("MongoDB connection successful");
    });
}
app.get('/auth/:username/:password', [
    (0, express_validator_1.param)('username').notEmpty().isString().isAlphanumeric(),
    (0, express_validator_1.param)('password').notEmpty().isString(),
    checkValidationErrors,
    auth_js_1.authenticateUser,
], (req, res) => {
    const token = { token: (0, token_1.generateAccessToken)(req.user, req.id) };
    res.json(token);
});
app.post('/register', [
    (0, express_validator_1.body)('username').notEmpty().isString().isAlphanumeric(),
    (0, express_validator_1.body)('password').notEmpty().isString(),
    checkValidationErrors,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, mongoose_1.getUser)(req.body.username);
    console.log(user);
    if (user != null && user != undefined) {
        res.status(400).send("User already exists");
    }
    if (yield (0, mongoose_1.addUser)(req.body.username, req.body.password)) {
        const newUser = yield (0, mongoose_1.getUser)(req.body.username);
        if (newUser == null) {
            res.status(500).send();
        }
        const token = { token: (0, token_1.generateAccessToken)(newUser.username, newUser._id.toString()) };
        res.json(token);
    }
    else {
        res.status(500).send();
    }
}));
app.get('/tasks', [
    token_1.authenticateToken,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield (0, mongoose_1.getTasks)(req.id);
    res.json({ tasks: tasks });
}));
app.post('/tasks', [
    (0, express_validator_1.body)('title').notEmpty().isString(),
    (0, express_validator_1.body)('description').notEmpty().isString(),
    //checkValidationErrors,
    token_1.authenticateToken,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongoose_1.addTask)(req.body.title, req.body.description, req.id);
    res.sendStatus(200);
}));
app.delete('/task/:id', [
    (0, express_validator_1.param)('id').notEmpty().isString(),
    //checkValidationErrors,
    token_1.authenticateToken,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield (0, mongoose_1.checkTask)(req.params.id))) {
        res.sendStatus(404);
    }
    else {
        yield (0, mongoose_1.deleteTask)(req.params.id);
        res.sendStatus(200);
    }
}));
app.patch('/task/:id', [
    (0, express_validator_1.param)('id').notEmpty().isString(),
    (0, express_validator_1.body)('completed').isBoolean(),
    //checkValidationErrors,
    token_1.authenticateToken,
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const check = !(yield (0, mongoose_1.checkTask)(req.params.id));
    console.log(check);
    if (check) {
        console.log('not found');
        res.sendStatus(404);
    }
    else {
        yield (0, mongoose_1.updateTask)(req.params.id, req.body.completed);
        console.log(yield (0, mongoose_1.getTasks)(req.id));
        res.sendStatus(200);
    }
}));
const server = app.listen(port, () => initServer());
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
