import express from "express";
import BlogController from "../controllers/blog.js";
import {
  validateCreateBlog,
  validateUpdateBlog,
} from "../validations/blog.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";

export const router = express.Router();

// Public Routes
router.get("/", BlogController.getBlogs); // Fetch all blogs
router.get("/public", BlogController.getBlogsPublic); // Fetch public blogs
router.get("/:id", BlogController.getBlogById); // Fetch blog by ID (public)

// Admin Routes
router.post(
  "/",
  [validateCreateBlog, isAuthorised, isAdmin],
  BlogController.createBlog
); // Add a new blog
router.patch(
  "/:id",
  [validateUpdateBlog, isAuthorised, isAdmin],
  BlogController.updateBlog
); // Update an existing blog
router.delete(
  "/:id",
  [isAuthorised, isAdmin],
  BlogController.deleteBlog
); // Delete a blog
