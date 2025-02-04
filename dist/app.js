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
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const conection_string = process.env.CONNECTION_STRING || '';
//app.get("/", (req, res) => res.type('html').send(html));
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
    //param('username').notEmpty().isString().escape(),
    //param('password').notEmpty().isString(),
    auth_js_1.authenticateUser
], (req, res) => {
    const token = { token: (0, token_1.generateAccessToken)(req.user) };
    res.json(token);
});
const server = app.listen(port, () => initServer());
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
