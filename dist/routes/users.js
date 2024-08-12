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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const passwordUtils_1 = require("../utils/passwordUtils");
const router = (0, express_1.Router)();
/**
 * @route GET /users
 * @desc Send Admin Invitation user
 * @params email
 * @access Private
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}).select(["-password"]);
        res.status(200).send(users);
    }
    catch (_a) {
        res.status(500).send("Error en servicio. Intentar más tarde.");
    }
}));
/**
 * @route POST /users/login
 * @desc Retrieves user JWT, so we can store user data by decrypting the JWT in the frontend
 * @params email, password
 * @access Public
 */
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const { JWT_SECRET: secretKey } = process.env;
    if (!secretKey) {
        res.status(500).json({
            error: "Presentamos errores en el servidor, favor de comunicarse con el desarrollador.",
        });
        return;
    }
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        res.status(400).json({
            error: "Datos incorrectos",
        });
        return;
    }
    const isMatchingPassword = yield (0, passwordUtils_1.verifyPassword)(password, user.password);
    if (isMatchingPassword) {
        const payload = (0, passwordUtils_1.transformUserToPayload)(user.toObject());
        jsonwebtoken_1.default.sign(payload, secretKey, {
            expiresIn: "100d",
        }, (error, encoded) => {
            if (error) {
                console.log(error);
                res.status(401).json({
                    error: "Usuario no autorizado.",
                });
                return;
            }
            res.status(200).json({
                success: true,
                encoded,
            });
        });
        return;
    }
    else {
        res.status(400).json({ error: "Los datos de acceso son incorrectos" });
        return;
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map