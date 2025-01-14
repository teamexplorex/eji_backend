import express from "express";
import BookedPackagesController from "../controllers/bookedPackage.js";
import {
  validateCreateBookedPackage,
  validateUpdateBookedPackage,
} from "../validations/bookedPackage.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";

export const router = express.Router();

router.get("/", [isAuthorised], BookedPackagesController.getBookedPackages); // Get all bookings
router.get("/count", [isAuthorised, isAdmin], BookedPackagesController.getBookingCount); // Get booking count for admin
router.get("/history", [isAuthorised], BookedPackagesController.getBookingHistory); // Get user's booking history
router.get(
  "/revenue/count",
  [isAuthorised, isAdmin],
  BookedPackagesController.getRevenueCount
); // Get revenue count for admin
router.get("/:id", [isAuthorised], BookedPackagesController.getBookedPackageById); // Get a single booking by ID
router.post(
  "/create",
  [isAuthorised, validateCreateBookedPackage],
  BookedPackagesController.createBookedPackage
); // Create a new booking
router.patch(
  "/:id",
  [isAuthorised, validateUpdateBookedPackage],
  BookedPackagesController.updateBookedPackage
); // Update an existing booking
router.post(
  "/payment/webhook",
  BookedPackagesController.paymentVerification
); // Handle payment webhook
