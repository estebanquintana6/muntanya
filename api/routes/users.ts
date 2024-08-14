import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import isAuth from "../middlewares/isAuth";
import User from "../models/User";

import { verifyPassword, transformUserToPayload } from "../utils/passwordUtils";

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

/**
 * @route POST /users/login
 * @desc Retrieves user JWT, so we can store user data by decrypting the JWT in the frontend
 * @params email, password
 * @access Public
 */
router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const { JWT_SECRET: secretKey } = process.env;
  
    if (!secretKey) {
      res.status(500).json({
        error: "Presentamos errores en el servidor, favor de comunicarse con el desarrollador.",
      });
      return;
    }
  
    const user = await User.findOne({ username });
  
    if (!user) {
      res.status(400).json({
        error: "Datos incorrectos",
      });
      return;
    }
  
    const isMatchingPassword = await verifyPassword(password, user.password);
  
    if (isMatchingPassword) {
      const { username, name, role } = user;
  
      jwt.sign(
        { username, name, role },
        secretKey,
        {
          expiresIn: "10d",
        },
        (error, encoded) => {
          if (error) {
            console.log(error);
            res.status(401).json({
              error: "Usuario no autorizado.",
            });
            return;
          }
  
          res.status(200).json({
            success: true,
            encoded,
          });
        },
      );
      return;
    } else {
      res.status(400).json({ error: "Los datos de acceso son incorrectos" });
      return;
    }
  });

export default router;