import { z } from "zod";

// User Registration Schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

// User Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// 2FA Login Validation Schema
export const validate2faSchema = z.object({
  tempToken: z.string().min(1, "Temporary 2FA token is required"),
  token: z.string().length(6, "TOTP code must be exactly 6 digits").regex(/^\d+$/, "TOTP code must be numeric"),
});

// Password Change Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "New password must contain at least one special character"),
});

// Secret Creation Schema
export const createSecretSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  data: z.string().min(1, "Secret data is required"),
  type: z.enum(["secret", "key", "password"]).default("secret"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional().default(""),
  expiresAt: z.string().datetime().nullable().optional(),
  rotationReminderDays: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string().trim()).optional().default([]),
  folder: z.string().max(50, "Folder name cannot exceed 50 characters").optional().default(""),
  isFavorite: z.boolean().optional().default(false),
});

// Secret Update Schema
export const updateSecretSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(100, "Title cannot exceed 100 characters").optional(),
  data: z.string().min(1, "Secret data cannot be empty").optional(),
  type: z.enum(["secret", "key", "password"]).optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  rotationReminderDays: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string().trim()).optional(),
  folder: z.string().max(50, "Folder name cannot exceed 50 characters").optional(),
  isFavorite: z.boolean().optional(),
});

// Export Vault Schema
export const exportVaultSchema = z.object({
  passphrase: z.string().min(6, "Export passphrase must be at least 6 characters long"),
});

// Import Vault Schema
export const importVaultSchema = z.object({
  passphrase: z.string().min(6, "Import passphrase must be at least 6 characters long"),
  backupData: z.object({
    salt: z.string().min(1),
    iv: z.string().min(1),
    authTag: z.string().min(1),
    encryptedVault: z.string().min(1),
  }),
});

// 2FA Enable Verification Schema
export const verify2faSchema = z.object({
  token: z.string().length(6, "TOTP code must be exactly 6 digits").regex(/^\d+$/, "TOTP code must be numeric"),
});

// 2FA Disable Confirmation Schema
export const disable2faSchema = z.object({
  password: z.string().min(1, "Current password is required to disable 2FA"),
});
