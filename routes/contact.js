import express from "express";
import ContactController from "../controllers/contact.js";
import {
  validateCreateContact,
  validateUpdateContact,
} from "../validations/contact.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from '../middlewares/user.js'

export const router = express.Router();

// Public and Admin Routes
router.get("/", [isAuthorised, isAdmin], ContactController.getContacts); // Fetch all contacts

// Admin Routes
router.post(
  "/",
  [validateCreateContact, isAuthorised],
  ContactController.createContact
); // Create a new contact
router.patch(
  "/:id",
  [validateUpdateContact, isAuthorised, isAdmin],
  ContactController.updateContact
); // Update an existing contact
router.delete("/:id", [isAuthorised, isAdmin], ContactController.deleteContact); // Delete a contact
