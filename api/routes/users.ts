import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import isAuth from "../middlewares/isAuth";
import User from "../models/User";

const router = Router();

/**
 * @route GET /users
 * @desc Send Admin Invitation user
 * @params email
 * @access Private
 */
router.get("/", async (req: Request, res: Response) => {
    try {
      const users = await User.find({}).select(["-password"]);
      res.status(200).send(users);
    } catch {
      res.status(500).send("Error en servicio. Intentar más tarde.");
    }
});

export default router;