import { Router, Request, Response } from "express";
import Contact from "../models/Contact";
import isAuthMiddleware from "../middlewares/isAuth";

const router = Router();

interface RequestData {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  instagram: string;
  knowMethod: string;
  services: string[];
  description: string;
}

/**
 * @route GET /quoter
 * @desc Get all contacts
 * @access Private
 */
router.get("/", isAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
    return;
  } catch (e) {
    res.status(500).json({ error: "No se pudieron obtener los contactos" });
  }
});

/**
 * @route GET /quoter/:id
 * @desc Get all contacts
 * @access Private
 */
router.get("/:id", isAuthMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const quote = await Contact.findById(id);
    res.status(200).json(quote);
    return;
  } catch (e) {
    res.status(500).json({ error: "No se pudo obtener el contacto" });
  }
});

/**
 * @route POST /quoter/attend
 * @desc Mark a quote as attended
 * @access Private
 */
router.post(
  "/attend",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const { _id, attended }: { _id: string; attended: boolean } = req.body;
    try {
      const quote = await Contact.findByIdAndUpdate(_id, { attended });
      res.status(200).json(quote);
      return;
    } catch (e) {
      res.status(500).json({ error: "La cotización no se pudo actualizar" });
    }
  },
);

/**
 * @route DELETE /quoter/delete
 * @desc delete a quoter by id
 * @access Private
 */
router.delete(
  "/delete",
  isAuthMiddleware,
  async (req: Request, res: Response) => {
    const { _id } = req.body;
    try {
      const to_delete = await Contact.findByIdAndDelete(_id);
      res.status(200).json(to_delete);
      return;
    } catch (e) {
      res.status(500).json({ error: "No se pudo eliminar el contacto" });
    }
  },
);

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
router.post("/create", async (req: Request, res: Response) => {
  const data: RequestData = req.body;
  try {
    const contact = new Contact(data);
    const saved = await contact.save();

    res.status(200).json(saved);
    return;
  } catch (e) {
    res.status(500).json({ error: "No se pudo crear el contacto" });
  }
});

export default router;
