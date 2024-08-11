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
exports.initDb = void 0;
const User_1 = __importDefault(require("../models/User"));
const passwordUtils_1 = require("./passwordUtils");
const createAdmin = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const { FIRST_ADMIN_PASSWORD: adminPassword } = process.env;
    const adminExist = yield User_1.default.findOne({ username });
    if (adminExist || !adminPassword)
        return;
    const hashedPassword = yield (0, passwordUtils_1.hashPassword)(adminPassword);
    const newAdmin = new User_1.default({
        username,
        password: hashedPassword,
        name: "Esteban Quintana",
        role: "SUPERADMIN"
    });
    const response = yield newAdmin.save();
    if (response.id)
        console.log("FIRST ADMIN CREATED:", username);
});
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const { ADMIN_USERNAME: adminUsername } = process.env;
    if (adminUsername) {
        yield createAdmin(adminUsername);
    }
});
exports.initDb = initDb;
//# sourceMappingURL=initDb.js.map