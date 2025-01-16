import mongoose from "mongoose";
import { Validations, dateToMillis } from "../constants/common.js";

const PackageSchema = mongoose.Schema(
  {
    name: Validations(String),
    shortDescription: Validations(String),
    longDescription: Validations(String),
    stays: [
      {
        days: Validations(Number),
        nights: Validations(Number),
        cityName: Validations(String),
      },
    ],
    actualPrice: Validations(Number),
    discountedPrice: Validations(Number),
    totalNights: Validations(Number),
    slug: Validations(String, { unique: true }),
    totalDays: Validations(Number),
    isFlightIncluded: Validations(Boolean),
    tags: Validations([String]),
    shortMainCardImage: Validations(String),
    images: Validations([String]),
    da: [
      {
        day: Validations(Number),
        description: Validations(String),
        images: Validations([String]), // Add images array
        title: Validations(String),
      },
    ],
    tourValidity: Validations(String),
    inclusions: Validations([String]),
    exclusions: Validations([String]),
    termsAndConditions: Validations(String),
    travelEssentials: Validations([String]),
    type: Validations(String, {
      enum: ["PACKAGE", "EXPERIENCE"],
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

export default mongoose.model("Package", PackageSchema);
