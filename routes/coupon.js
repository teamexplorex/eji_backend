import express from "express";
import CouponController from "../controllers/coupon.js";
import { isAuthorised } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/user.js";
import { validateCreateCoupon, validateUpdateCoupon } from "../validations/coupon.js";

export const router = express.Router();

router.get("/", [isAuthorised, isAdmin], CouponController.getCoupons);
router.get("/latest",[isAuthorised], CouponController.getLatestCoupon)
router.get("/validate", [isAuthorised], CouponController.validateCoupon);
router.get("/:id", [isAuthorised, isAdmin], CouponController.getCoupon);
router.post(
  "/",
  [validateCreateCoupon, isAuthorised, isAdmin],
  CouponController.addCoupon
);
router.patch(
  "/:id",
  [validateUpdateCoupon, isAuthorised, isAdmin],
  CouponController.updateCoupon
);
router.delete("/:id", [isAuthorised, isAdmin], CouponController.deleteCoupon);

