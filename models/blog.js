import mongoose from "mongoose";
import { Validations, dateToMillis } from "../constants/common.js";

const BlogSchema = mongoose.Schema(
  {
    title: Validations(String, { required: true }),
    priority: Validations(Number, { required: true }),
    description: Validations(String, { required: true }),
    content: Validations(String, { required: true }), // Save Quill editor HTML
    tags: Validations([String]), // Array of strings
    slug: Validations(String, { required: true }),
    bannerImage: Validations(String, { required: true }),
    smallBannerImage: Validations(String, { required: true }),
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

export default mongoose.model("Blog", BlogSchema);
