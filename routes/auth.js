import express from "express";
import AuthController from "../controllers/auth.js";
import { validateAdminloginUser, validateOtp, validateloginUser } from "../validations/auth.js";
export const router = express.Router();

router.post("/login", [validateloginUser], AuthController.login);
router.post("/login/admin", [validateAdminloginUser], AuthController.adminLogin);
router.post("/verify-otp", [validateOtp], AuthController.verifyOtp);
router.post("/resend-otp", [validateloginUser], AuthController.resendOtp);
router.post("/logout", AuthController.logout);