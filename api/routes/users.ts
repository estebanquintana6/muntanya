import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import isAuth, { isSuperAdmin } from "../middlewares/isAuth";
import User from "../models/User";

import { verifyPassword, hashPassword } from "../utils/passwordUtils";

const router = Router();

/**
 * @route GET /users
 * @desc Send Admin Invitation user
 * @params email
 * @access Private
 */
router.get("/", isAuth, async (req: Request, res: Response) => {
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
      error:
        "Presentamos errores en el servidor, favor de comunicarse con el desarrollador.",
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

/**
 * @route POST /users/create
 * @desc Creates a new admin
 * @params username, name, password
 * @access Private (SUPERADMIN)
 */
router.post("/create", isSuperAdmin, async (req: Request, res: Response) => {
  const { body } = req;
  console.log(body);
  const {
    username,
    name,
    password,
    password2,
  }: { username: string; name: string; password: string; password2: string } =
    body;

  if (password2 !== password) {
    res.status(400).json({ error: "Las contraseñas no coinciden" });
    return;
  }

  const duplicatedUser = await User.findOne({ username });

  if (duplicatedUser) {
    res.status(400).json({ error: "El nombre de usuario está duplicado" });
    return;
  }

  const hashedPassword = await hashPassword(password);

  try {
    const newUser = new User({
      username,
      name,
      role: "ADMIN",
      password: hashedPassword,
    });

    const saved = await newUser.save();

    res.status(200).json(saved);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Error en el servidor, comunicate con el desarrollador" });
  }
});

/**
 * @route DELETE /users/delete
 * @desc Deletes a user by id
 * @params id
 * @access Public
 */
router.delete("/delete", isSuperAdmin, async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = body;

  try {
    const deleted = await User.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (e) {
    res.status(500).json(e);
  }
});

export default router;
