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
const BlogEntry_1 = __importDefault(require("../models/BlogEntry"));
const router = (0, express_1.Router)();
/**
 * @route GET /blog
 * @desc Get all blog entries
 * @access Public
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogEntries = yield BlogEntry_1.default.find({}).sort({ created_at: -1 });
        res.status(200).send(blogEntries);
    }
    catch (_a) {
        res.status(500).send("Error en servicio. Intentar más tarde.");
    }
}));
/**
 * @route GET /blog/recent
 * @desc Get the 3 latest blog entries
 * @access Public
 */
router.get("/recent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogEntries = yield BlogEntry_1.default.find({})
            .sort({ created_at: -1 })
            .limit(3);
        res.status(200).send(blogEntries);
    }
    catch (_a) {
        res.status(500).send("Error en servicio. Intentar más tarde.");
    }
}));
/**
 * @route GET /blog/?
 * @desc Get blog entry by id
 * @params id
 * @access Public
 */
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blogEntry = yield BlogEntry_1.default.findById(id);
        res.status(200).send(blogEntry);
    }
    catch (_a) {
        res.status(404).send({ error: "La entrada de blog no existe" });
    }
}));
/**
 * @route POST /blog/create
 * @desc Create a new blog entry
 * @params title, description, photo_urls, tags
 * @access Private
 */
router.post("/create", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, photo_urls, description, tags: toParseTags, subtitle, } = req.body;
    const tags = JSON.parse(toParseTags);
    if (!title || !description) {
        res.status(400).json({
            error: "Datos faltantes o incompletos",
        });
        return;
    }
    const new_blog_entry = new BlogEntry_1.default({
        title,
        subtitle,
        description,
        photo_urls,
        tags,
    });
    const blog_entry = yield new_blog_entry.save();
    res.status(200).json(blog_entry);
}));
/**
 * @route POST /blog/update
 * @desc Update a new product
 * @params title, description, photo_urls
 * @access Private
 */
router.post("/update", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, subtitle, description, tags: toParseTags, toDeletePhotos, toAddPhotos, } = req.body;
    const tags = JSON.parse(toParseTags);
    if (!title || !description) {
        res.status(400).json({
            error: "Datos faltantes o incompletos",
        });
        return;
    }
    const to_update = yield BlogEntry_1.default.findById(id);
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
        subtitle,
        description,
        tags,
        photo_urls: new_photo_array,
    });
    res.status(200).json(updated);
}));
/**
 * @route GET /blog/related
 * @desc Get related for a product
 * @params product_id
 * @access Public
 */
router.get("/related/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blogEntries = yield BlogEntry_1.default.find({ _id: { $nin: id } })
            .sort({ created_at: -1 })
            .limit(3);
        res.status(200).json(blogEntries);
        return;
    }
    catch (_a) {
        res.status(500).json({
            error: "Error en servicio. Intentar más tarde.",
        });
        return;
    }
}));
/**
 * @route DELETE /blog/delete
 * @desc Delete a product
 * @params _id
 * @access Private
 */
router.delete("/delete", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    const to_delete = yield BlogEntry_1.default.findById(_id);
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
            .json({ error: "Error en el servidor al borrar la entrada de blog" });
    }
}));
exports.default = router;
//# sourceMappingURL=blog.js.map