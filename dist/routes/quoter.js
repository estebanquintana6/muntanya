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
const Contact_1 = __importDefault(require("../models/Contact"));
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const router = (0, express_1.Router)();
/**
 * @route GET /quoter
 * @desc Get all contacts
 * @access Private
 */
router.get("/", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield Contact_1.default.find({});
        res.status(200).json(contacts);
        return;
    }
    catch (e) {
        res.status(500).json({ error: "No se pudieron obtener los contactos" });
    }
}));
/**
 * @route GET /quoter/:id
 * @desc Get all contacts
 * @access Private
 */
router.get("/:id", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const quote = yield Contact_1.default.findById(id);
        res.status(200).json(quote);
        return;
    }
    catch (e) {
        res.status(500).json({ error: "No se pudo obtener el contacto" });
    }
}));
/**
 * @route POST /quoter/attend
 * @desc Mark a quote as attended
 * @access Private
 */
router.post("/attend", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, attended } = req.body;
    try {
        const quote = yield Contact_1.default.findByIdAndUpdate(_id, { attended });
        res.status(200).json(quote);
        return;
    }
    catch (e) {
        res.status(500).json({ error: "La cotización no se pudo actualizar" });
    }
}));
/**
 * @route DELETE /quoter/delete
 * @desc delete a quoter by id
 * @access Private
 */
router.delete("/delete", isAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    try {
        const to_delete = yield Contact_1.default.findByIdAndDelete(_id);
        res.status(200).json(to_delete);
        return;
    }
    catch (e) {
        res.status(500).json({ error: "No se pudo eliminar el contacto" });
    }
}));
/**
 * @route POST /quoter/create
 * @desc Create a contact request
 * @params {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    instagram: string;
    knowMethod: string;
    services: string[];
    description: string;
  }
 * @access Public
 */
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const contact = new Contact_1.default(data);
        const saved = yield contact.save();
        res.status(200).json(saved);
        return;
    }
    catch (e) {
        res.status(500).json({ error: "No se pudo crear el contacto" });
    }
}));
exports.default = router;
//# sourceMappingURL=quoter.js.map