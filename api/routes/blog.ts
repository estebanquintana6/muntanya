import { Router, Request, Response } from "express";
import { del } from "@vercel/blob";

import isAuthMiddleware from "../middlewares/isAuth";
import BlogEntry from "../models/BlogEntry";

const router = Router();

/**
 * @route GET /blog
 * @desc Get all blog entries
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const blogEntries = await BlogEntry.find({});
    res.status(200).send(blogEntries);
  } catch {
    res.status(500).send("Error en servicio. Intentar más tarde.");
  }
});

/**
 * @route GET /blog/recent
 * @desc Get the 3 latest blog entries
 * @access Public
 */
router.get("/recent", async (req: Request, res: Response) => {
  try {
    const blogEntries = await BlogEntry.find({}).sort({ created_at: -1 }).limit(3);
    res.status(200).send(blogEntries);
  } catch {
    res.status(500).send("Error en servicio. Intentar más tarde.");
  }
});

/**
 * @route GET /blog/?
 * @desc Get blog entry by id
 * @params id
 * @access Public
 */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const blogEntry = await BlogEntry.findById(id);
    res.status(200).send(blogEntry);
  } catch {
    res.status(404).send({ error: "La entrada de blog no existe" });
  }
});

/**
 * @route POST /blog/create
 * @desc Create a new blog entry
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

    const new_blog_entry = new BlogEntry({
      title,
      subtitle,
      description,
      photo_urls,
      tags,
    });

    const blog_entry = await new_blog_entry.save();

    res.status(200).json(blog_entry);
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

    const to_update = await BlogEntry.findById(id);

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

    const to_delete = await BlogEntry.findById(_id);

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
        .json({ error: "Error en el servidor al borrar la entrada de blog" });
    }
  },
);
export default router;
