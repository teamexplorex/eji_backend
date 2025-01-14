import mongoose from "mongoose";
import { Validations, dateToMillis } from "../constants/common.js";

const BookedPackagesSchema = mongoose.Schema(
  {
    packageId: Validations(mongoose.Types.ObjectId, {
      ref: "Package",
      required: true,
    }),
    paidPrice: Validations(Number, { required: true }),
    travelDates: Validations([Date], { required: true }),
    coupon: {
      name: Validations(String),
      isPercentage: Validations(Boolean),
      amount: Validations(Number),
    },
    totalMrpAmount: Validations(Number, { required: true }),
    discountedAmount: Validations(Number),
    status: Validations(String, {
      enum: ["CANCELLED", "BOOKED", "PENDING"],
      required: true,
    }),
    isWebhookEvent: Validations(Boolean, {
      index: true,
      default: false,
    }),
    isRefunded: Validations(Boolean, {
      index: true,
      default: false,
    }),
    userId: Validations(mongoose.Types.ObjectId, {
      ref: "User",
      index: true,
      required: true,
    }),
    orderId: Validations(String, {
      required: true,
      index: true,
    }),
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

export default mongoose.model("BookedPackage", BookedPackagesSchema);
