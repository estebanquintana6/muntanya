"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Create Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "SUPERADMIN"],
        default: "ADMIN",
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});
const Users = mongoose_1.default.model('Users', UserSchema);
exports.default = Users;
//# sourceMappingURL=User.js.map