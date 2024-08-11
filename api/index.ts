import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { initDb } from "./utils/initDb";

dotenv.config()

const { MONGO_URI } = process.env;

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const mongoConnection = () => mongoose.connect(MONGO_URI || "");

mongoConnection();

const db = mongoose.connection;

db.on("error", (err: Error) => {
    console.log("There was a problem connecting to mongo: ", err);
    console.log("Trying again");
    setTimeout(() => mongoConnection(), 5000);
});
db.once("open", async () => {
    await initDb();
    console.log("Successfully connected to mongo");
});

app.get("/", (req, res) => res.send("Muntanya server up & running"));

app.listen(4000, () => console.log("Server ready on port 4000."));

export default app;