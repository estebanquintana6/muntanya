import { Router, Request, Response } from "express";
import { del } from "@vercel/blob";

import isAuthMiddleware from "../middlewares/isAuth";
import Product from "../models/Product";

const router = Router();

/**
 * @route GET /products
 * @desc Get all products
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
 * @route GET /favorite
 * @desc Fetch favorite products
 * @params none
 * @access Public
 */
router.get("/favorite", async (req: Request, res: Response) => {
  try {
    const products = await Product.find(
      { favorite: true },
      {},
      { sort: { created_at: -1 } },
    ).limit(4);
    res.status(200).send(products);
  } catch {
    res.status(200).send([]);
  }
});

/**
 * @route GET /product/?
 * @desc Get product by id
 * @params id
 * @access Public
 */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).send(product);
  } catch {
    res.status(404).send({ error: "El producto no existe" });
  }
});

/**
 * @route GET /products/related
 * @desc Get related for a product
 * @params product_id
 * @access Public
 */
router.get("/related/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const products = await Product.find({ _id: { $nin: id } }).limit(3);
    res.status(200).json(products);
    return;
  } catch {
    res.status(500).json({
      error: "Error en servicio. Intentar más tarde.",
    });
    return;
  }
});

/**
 * @route POST /projects/create
 * @desc Create a new product
 * @params title, description, photo_urls, tags
 * @access Private
 */
router.post(
  "/create",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const {
      title,
      photo_urls,
      description,
      tags: toParseTags,
      subtitle,
    } = req.body;

    const tags = JSON.parse(toParseTags);

    if (!title || !description) {
      res.status(400).json({
        error: "Datos faltantes o incompletos",
      });
      return;
    }

    const new_product = new Product({
      title,
      subtitle,
      description,
      photo_urls,
      tags,
    });

    const product = await new_product.save();

    res.status(200).json(product);
  },
);

/**
 * @route POST /projects/update
 * @desc Update a new product
 * @params title, description, photo_urls
 * @access Private
 */
router.post(
  "/update",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const {
      id,
      title,
      subtitle,
      description,
      tags: toParseTags,
      toDeletePhotos,
      toAddPhotos,
    } = req.body as {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      tags: string;
      toDeletePhotos: string[];
      toAddPhotos: string[];
    };

    const tags = JSON.parse(toParseTags);

    if (!title || !description) {
      res.status(400).json({
        error: "Datos faltantes o incompletos",
      });
      return;
    }

    const to_update = await Product.findById(id);

    if (!to_update) {
      res.status(404).json({ error: "El producto no existe" });
      return;
    }

    const { photo_urls } = to_update;

    const new_photo_array = [
      ...photo_urls.filter((url) => !toDeletePhotos.includes(url)),
      ...toAddPhotos,
    ];

    const updated = await to_update.updateOne({
      title,
      subtitle,
      description,
      tags,
      photo_urls: new_photo_array,
    });

    res.status(200).json(updated);
  },
);

/**
 * @route POST /projects/favorite
 * @desc Favorite/Unfavorite a product
 * @params id, favorite
 * @access Private
 */
router.post(
  "/favorite",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const { id, favorite = false } = req.body as {
      id: string;
      favorite: boolean;
    };

    if (!id) {
      res.status(400).json({ error: "Falta información" });
    }

    try {
      const to_update = await Product.findById(id);

      const updated = await to_update.updateOne({
        favorite,
      });

      res.status(200).json(updated);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
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

    if (!to_delete) {
      res.status(200).json({ success: true, msg: "El archivo no existe" });
      return;
    }

    const { photo_urls } = to_delete;

    try {
      if (photo_urls.length > 0) {
        await del(photo_urls);
      }

      const deleted = await to_delete.deleteOne();

      res.status(200).json(deleted);
    } catch (e) {
      res
        .status(500)
        .json({ error: "Error en el servidor al borrar el producto" });
    }
  },
);
export default router;
