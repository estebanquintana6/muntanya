import { Router, Request, Response } from "express";
import { del } from '@vercel/blob'

import isAuthMiddleware from "../middlewares/isAuth";
import Product from "../models/Product";

const router = Router();

/**
 * @route GET /products
 * @desc Get all products
 * @params email
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.status(200).send(products);
  } catch {
    res.status(500).send("Error en servicio. Intentar más tarde.");
  }
});

/**
 * @route POST /projects/create
 * @desc Create a new product
 * @params title, description, photo_urls
 * @access Private
 */
router.post(
  "/create",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const { title, photo_urls, description } = req.body;

    if (!title || !description) {
        res.status(400).json({
          error: "Datos faltantes o incompletos",
        });
        return;
    }

    const new_product = new Product({
        title,
        description,
        photo_urls,
    });

    const product = await new_product.save();

    res.status(200).json(product);
  },
);

/**
 * @route DELETE /projects/delete
 * @desc Delete a product
 * @params _id
 * @access Private
 */
router.delete(
  "/delete",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const { _id } = req.body;

    const to_delete = await Product.findById(_id);

    const { photo_urls } = to_delete;

    del(photo_urls).then(async () => {
      const deleted = await to_delete.deleteOne();
      res.status(200).json(deleted);
    });
})
export default router;
