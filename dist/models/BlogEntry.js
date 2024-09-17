"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const BlogEntry = new Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true
    },
    photo_urls: [{
            type: String,
        }],
    tags: [{
            type: String,
        }],
    created_at: {
        type: Date,
        default: Date.now
    },
});
const Products = mongoose_1.default.model('BlogEntry', BlogEntry);
exports.default = Products;
//# sourceMappingURL=BlogEntry.js.map