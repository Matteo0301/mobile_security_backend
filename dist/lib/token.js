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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.authenticateToken = authenticateToken;
exports.setSecret = setSecret;
const jsonwebtoken_1 = require("jsonwebtoken");
const mongoose_1 = require("./mongoose");
let secret = "";
function generateAccessToken(username, id) {
    return (0, jsonwebtoken_1.sign)({ username: username, id: id }, secret, { expiresIn: '24h' });
}
function setSecret(new_secret) {
    secret = new_secret;
}
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        const header = req.headers['authorization'];
        console.log(req.headers);
        console.log('hello');
        if (header && typeof header === 'string') {
            if (header.startsWith('Bearer ')) {
                token = header.split(' ')[1];
            }
            else {
                console.log('wring header format');
                res.sendStatus(401);
                return;
            }
        }
        else {
            console.log('wrong header type');
            console.log(header);
            console.log(typeof header);
            res.sendStatus(401);
            return;
        }
        if (token == null) {
            console.log('null token');
            res.sendStatus(401);
            return;
        }
        (0, jsonwebtoken_1.verify)(token, secret, (err, user) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(403).send();
                return;
            }
            // Check if user is in the database
            const db_user = yield (0, mongoose_1.getUser)(user.username);
            if (!db_user) {
                return res.status(403).send();
            }
            req.user = user.username;
            req.id = user.id;
            next();
        }));
    });
}
