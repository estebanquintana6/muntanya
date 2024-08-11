import { Request, Response } from "express";

import User from "../models/User";

import jwt from "jsonwebtoken";

const isAuth = async (req: Request, res: Response, next: () => void) => {
    const { headers } = req;
    const { authorization } = headers;

    const { JWT_SECRET: secretKey } = process.env;

    if(!authorization || !secretKey) {
        res.status(401).send("Acceso denegado");
        return;
    }

    try {

        const { username } : typeof User.prototype = jwt.decode(authorization);

        const user = await User.findOne({ username });

        if (!user) {
            res.status(401).json({
                error: "Acceso denegado"
            });
            return;
        }

        const validToken = jwt.verify(authorization, secretKey);


        if (validToken) {
            return next();
        } else {
            res.status(401).json({
                error: "Acceso denegado"
            });
            return;
        }
    } catch(err) {
        res.status(500).json({
            error: "Fallo en servidor. Intentar más tarde."
        });
        return;
    }
}

export default isAuth;