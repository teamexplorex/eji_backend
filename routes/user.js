import express from "express";
import UserController from "../controllers/user.js";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../validations/user.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";

export const router = express.Router();

router.get("/", isAuthorised, UserController.getUser);
router.get("/count",[isAuthorised, isAdmin], UserController.getUsersCount);
router.get("/all",[isAuthorised, isAdmin], isAuthorised, UserController.getUsers);
router.patch("/:id", [isAuthorised, validateUpdateUser], UserController.updateUser);
router.delete("/:id", [isAuthorised, isAdmin], UserController.deleteUser);
router.post("/create", [isAuthorised, isAdmin, validateCreateUser], UserController.createUser);