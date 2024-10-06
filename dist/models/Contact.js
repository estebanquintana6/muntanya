"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ContactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    instagram: {
        type: String,
        required: false,
    },
    knowMethod: {
        type: String,
        required: false,
    },
    services: [
        {
            type: String,
            required: false,
        },
    ],
    description: {
        type: String,
        required: true,
    },
});
const Contacts = mongoose_1.default.model("Contacts", ContactSchema);
exports.default = Contacts;
//# sourceMappingURL=Contact.js.map