import mongoose from "mongoose";
import { Validations } from "../constants/common.js";

const CouponSchema = mongoose.Schema(
  {
    name: Validations(String, {
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index:true
    }),
    amount: Validations(Number),
    isPercentage: Validations(Boolean),
    minAmountPerPackage: Validations(Number),
    maxEntry: Validations(Number, {
      required: true,
    }),
    maxEntryPerUser: Validations(Number, {
      required: true,
    }),
    usersAppliedCoupons: {},
    couponAppliedCount: Validations(Number, {
      default: 0,
    }),
    isActive: Validations(Boolean, {
      default: false,
    }),
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", CouponSchema);
