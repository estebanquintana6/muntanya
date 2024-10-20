"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const isAuth_1 = __importStar(require("../middlewares/isAuth"));
const User_1 = __importDefault(require("../models/User"));
const passwordUtils_1 = require("../utils/passwordUtils");
const router = (0, express_1.Router)();
/**
 * @route GET /users
 * @desc Send Admin Invitation user
 * @params email
 * @access Private
 */
router.get("/", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { username, name, role } = user;
        jsonwebtoken_1.default.sign({ username, name, role }, secretKey, {
            expiresIn: "10d",
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
/**
 * @route POST /users/create
 * @desc Creates a new admin
 * @params username, name, password
 * @access Private (SUPERADMIN)
 */
router.post("/create", isAuth_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body);
    const { username, name, password, password2, } = body;
    if (password2 !== password) {
        res.status(400).json({ error: "Las contraseñas no coinciden" });
        return;
    }
    const duplicatedUser = yield User_1.default.findOne({ username });
    if (duplicatedUser) {
        res.status(400).json({ error: "El nombre de usuario está duplicado" });
        return;
    }
    const hashedPassword = yield (0, passwordUtils_1.hashPassword)(password);
    try {
        const newUser = new User_1.default({
            username,
            name,
            role: "ADMIN",
            password: hashedPassword,
        });
        const saved = yield newUser.save();
        res.status(200).json(saved);
    }
    catch (e) {
        res
            .status(500)
            .json({ error: "Error en el servidor, comunicate con el desarrollador" });
    }
}));
/**
 * @route DELETE /users/delete
 * @desc Deletes a user by id
 * @params id
 * @access Public
 */
router.delete("/delete", isAuth_1.isSuperAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = body;
    try {
        const deleted = yield User_1.default.findByIdAndDelete(id);
        res.status(200).json(deleted);
    }
    catch (e) {
        res.status(500).json(e);
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map