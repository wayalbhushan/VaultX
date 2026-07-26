import express from "express";
import {
  createSecret,
  getAllSecrets,
  getSecretById,
  updateSecret,
  deleteSecret,
} from "../controllers/secretController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validation.js";
import { createSecretSchema, updateSecretSchema } from "../utils/schemas.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllSecrets);
router.get("/:id", getSecretById);
router.post("/", validateBody(createSecretSchema), createSecret);
router.put("/:id", validateBody(updateSecretSchema), updateSecret);
router.delete("/:id", deleteSecret);

export default router;
