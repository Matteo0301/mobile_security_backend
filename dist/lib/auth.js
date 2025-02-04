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
exports.authenticateUser = authenticateUser;
exports.checkTokenMatchesUser = checkTokenMatchesUser;
const mongoose_1 = require("./mongoose");
const bcrypt_1 = require("bcrypt");
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const request_user = req.params.username;
        const request_password = req.params.password;
        let user = yield (0, mongoose_1.getUser)(request_user);
        if (user && user.password !== undefined && user.password !== null) {
            if ((0, bcrypt_1.compareSync)(request_password, user.password)) {
                req.user = request_user;
                next();
            }
            else {
                res.sendStatus(401);
            }
        }
        else {
            res.sendStatus(401);
        }
    });
}
function checkTokenMatchesUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.user !== req.params.username) {
            res.sendStatus(403);
        }
        else {
            next();
        }
    });
}
