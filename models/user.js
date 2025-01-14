import mongoose from "mongoose";
import { ROLE, Validations, dateToMillis } from "../constants/common.js";

const UserSchema = mongoose.Schema(
  {
    name: Validations(String),
    number: Validations(String, { required: true }),
    email: Validations(String),
    role: Validations(String, { required: true, default: ROLE.USER }),
    otpCount: Validations(Number, {
      default: 0,
      index: true,
    }),
    otpCountUpdatedAt: Validations(Number),
    adminAccess: {
      ...Validations([String], {
        enum: [
          "BLOG",
          "PACKAGE",
          "CONTACT",
          "DASHBOARD",
          "USER",
          "PACKAGE_BOOKED",
          "COUPONS",
        ],
      }),
    },
    isBlock: Validations(Boolean, { default: false }),
    isActive: Validations(Boolean, { default: false }),
    tokenVersion: { ...Validations(Number, { default: 0 }) },
    isOnboardingCompleted: { ...Validations(Boolean, { default: true }) },
    password: { ...Validations(String) },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.createdAt = dateToMillis(ret.createdAt);
        ret.updatedAt = dateToMillis(ret.updatedAt);
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.createdAt = dateToMillis(ret.createdAt);
        ret.updatedAt = dateToMillis(ret.updatedAt);
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", UserSchema);
