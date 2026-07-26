import express from "express";
import {
  createSecret,
  getAllSecrets,
  getSecretById,
  updateSecret,
  deleteSecret,
} from "../controllers/secretController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllSecrets);
router.get("/:id", getSecretById);
router.post("/", createSecret);
router.put("/:id", updateSecret);
router.delete("/:id", deleteSecret);

export default router;

