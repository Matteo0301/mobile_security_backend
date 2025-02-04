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
let secret = "";
function generateAccessToken(username) {
    return (0, jsonwebtoken_1.sign)({ username: username }, secret, { expiresIn: '24h' });
}
function setSecret(new_secret) {
    secret = new_secret;
}
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        const header = req.headers['authorization'];
        if (header && typeof header === 'string') {
            if (header.startsWith('Bearer ')) {
                token = header.split(' ')[1];
            }
            else {
                res.sendStatus(401);
                return;
            }
        }
        else {
            res.sendStatus(401);
            return;
        }
        if (token == null) {
            return res.sendStatus(401);
        }
        (0, jsonwebtoken_1.verify)(token, secret, (err, user) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return res.sendStatus(403);
            }
            // Check if user is in the database
            /* const db_user = await getUser(user.username)
            if (!db_user) {
                Logger.debug('Authentication failed: ' + user.username + ' is not in the database')
                return res.sendStatus(403)
            } */
            req.user = user.username;
            next();
        }));
    });
}
