import express from "express";
import PackageController from "../controllers/package.js";
import {
  validateCreatePackage,
  validateUpdatePackage,
} from "../validations/package.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";

export const router = express.Router();

// Public Routes
router.get("/", PackageController.getPackages); // Fetch all packages
router.get("/:id", PackageController.getPackageById); // Fetch package by ID

// Admin Routes
router.post(
  "/",
  [validateCreatePackage, isAuthorised, isAdmin],
  PackageController.createPackage
); // Create a new package
router.patch(
  "/:id",
  [validateUpdatePackage, isAuthorised, isAdmin],
  PackageController.updatePackage
); // Update an existing package
router.delete(
  "/:id",
  [isAuthorised, isAdmin],
  PackageController.deletePackage
); // Delete a package
