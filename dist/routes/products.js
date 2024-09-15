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
const blob_1 = require("@vercel/blob");
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
 * @route GET /product/?
 * @desc Get all products
 * @params email
 * @access Public
 */
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield Product_1.default.findById(id);
        res.status(200).send(product);
    }
    catch (_a) {
        res.status(404).send({ error: "El producto no existe" });
    }
}));
/**
 * @route POST /projects/create
 * @desc Create a new product
 * @params title, description, photo_urls, tags
 * @access Private
 */
router.post("/create", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, photo_urls, description, tags: toParseTags } = req.body;
    const tags = JSON.parse(toParseTags);
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
        tags,
    });
    const product = yield new_product.save();
    res.status(200).json(product);
}));
/**
 * @route POST /projects/update
 * @desc Update a new product
 * @params title, description, photo_urls
 * @access Private
 */
router.post("/update", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, description, tags: toParseTags, toDeletePhotos, toAddPhotos, } = req.body;
    const tags = JSON.parse(toParseTags);
    if (!title || !description) {
        res.status(400).json({
            error: "Datos faltantes o incompletos",
        });
        return;
    }
    const to_update = yield Product_1.default.findById(id);
    if (!to_update) {
        res.status(404).json({ error: "El producto no existe" });
        return;
    }
    const { photo_urls } = to_update;
    const new_photo_array = [
        ...photo_urls.filter((url) => !toDeletePhotos.includes(url)),
        ...toAddPhotos,
    ];
    const updated = yield to_update.updateOne({
        title,
        description,
        tags,
        photo_urls: new_photo_array,
    });
    res.status(200).json(updated);
}));
/**
 * @route DELETE /projects/delete
 * @desc Delete a product
 * @params _id
 * @access Private
 */
router.delete("/delete", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    const to_delete = yield Product_1.default.findById(_id);
    if (!to_delete) {
        res.status(200).json({ success: true, msg: "El archivo no existe" });
        return;
    }
    const { photo_urls } = to_delete;
    try {
        if (photo_urls.length > 0) {
            yield (0, blob_1.del)(photo_urls);
        }
        const deleted = yield to_delete.deleteOne();
        res.status(200).json(deleted);
    }
    catch (e) {
        res
            .status(500)
            .json({ error: "Error en el servidor al borrar el producto" });
    }
}));
exports.default = router;
//# sourceMappingURL=products.js.map