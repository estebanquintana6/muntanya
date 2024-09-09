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
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const Product_1 = __importDefault(require("../models/Product"));
const router = (0, express_1.Router)();
/**
 * @route GET /products
 * @desc Get all products
 * @params email
 * @access Public
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({});
        res.status(200).send(products);
    }
    catch (_a) {
        res.status(500).send("Error en servicio. Intentar más tarde.");
    }
}));
/**
 * @route POST /projects/create
 * @desc Create a new product
 * @params title, description, photo_urls
 * @access Private
 */
router.post("/create", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, photo_urls, description } = req.body;
    if (!title || !description) {
        res.status(400).json({
            error: "Datos faltantes o incompletos",
        });
        return;
    }
    const new_product = new Product_1.default({
        title,
        description,
        photo_urls,
    });
    const product = yield new_product.save();
    res.status(200).json(product);
}));
exports.default = router;
//# sourceMappingURL=products.js.map