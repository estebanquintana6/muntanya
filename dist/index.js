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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const initDb_1 = require("./utils/initDb");
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
dotenv_1.default.config();
const { MONGO_URI } = process.env;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json()); //Used to parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
const mongoConnection = () => mongoose_1.default.connect(MONGO_URI || "");
mongoConnection();
const db = mongoose_1.default.connection;
db.on("error", (err) => {
    console.log("There was a problem connecting to mongo: ", err);
    console.log("Trying again");
    setTimeout(() => mongoConnection(), 5000);
});
db.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, initDb_1.initDb)();
    console.log("Successfully connected to mongo");
}));
app.get("/", (req, res) => res.send("Muntanya server up & running"));
app.use('/users', users_1.default);
app.use('/products', products_1.default);
app.listen(4000, () => console.log("Server ready on port 4000."));
exports.default = app;
//# sourceMappingURL=index.js.map