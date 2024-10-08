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
exports.transformUserToPayload = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = (plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    const password = yield bcryptjs_1.default.hash(plainPassword, salt);
    return password;
});
exports.hashPassword = hashPassword;
const verifyPassword = (plainPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = yield bcryptjs_1.default.compare(plainPassword, password);
    return isValid;
});
exports.verifyPassword = verifyPassword;
const transformUserToPayload = (user) => {
    const obj = Object.create(null);
    Object.keys(user).forEach(key => {
        obj[key] = user[key];
    });
    return obj;
};
exports.transformUserToPayload = transformUserToPayload;
//# sourceMappingURL=passwordUtils.js.map