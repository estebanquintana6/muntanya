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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { headers } = req;
    const { authorization } = headers;
    const { JWT_SECRET: secretKey } = process.env;
    if (!authorization || !secretKey) {
        res.status(401).send("Acceso denegado");
        return;
    }
    try {
        const { username } = jsonwebtoken_1.default.decode(authorization);
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({
                error: "Acceso denegado"
            });
            return;
        }
        const validToken = jsonwebtoken_1.default.verify(authorization, secretKey);
        if (validToken) {
            return next();
        }
        else {
            res.status(401).json({
                error: "Acceso denegado"
            });
            return;
        }
    }
    catch (err) {
        res.status(500).json({
            error: "Fallo en servidor. Intentar más tarde."
        });
        return;
    }
});
exports.default = isAuth;
//# sourceMappingURL=isAuth.js.map