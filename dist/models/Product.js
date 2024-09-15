"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ProductSchema = new Schema({
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
    favorite: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});
const Products = mongoose_1.default.model('Products', ProductSchema);
exports.default = Products;
//# sourceMappingURL=Product.js.map