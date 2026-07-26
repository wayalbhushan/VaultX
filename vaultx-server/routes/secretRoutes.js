import express from "express";
import {
  createSecret,
  getAllSecrets,
  getSecretById,
  updateSecret,
  deleteSecret,
  getSecretVersions,
  rollbackSecretVersion,
  toggleFavoriteSecret,
  getExpiredSecrets,
  exportVault,
  importVault,
} from "../controllers/secretController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validation.js";
import {
  createSecretSchema,
  updateSecretSchema,
  exportVaultSchema,
  importVaultSchema,
} from "../utils/schemas.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllSecrets);
router.get("/expired", getExpiredSecrets);
router.post("/export", validateBody(exportVaultSchema), exportVault);
router.post("/import", validateBody(importVaultSchema), importVault);

router.get("/:id", getSecretById);
router.get("/:id/versions", getSecretVersions);
router.post("/:id/rollback/:targetVersion", rollbackSecretVersion);
router.put("/:id/favorite", toggleFavoriteSecret);
router.post("/", validateBody(createSecretSchema), createSecret);
router.put("/:id", validateBody(updateSecretSchema), updateSecret);
router.delete("/:id", deleteSecret);

export default router;
