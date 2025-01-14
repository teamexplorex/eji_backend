import mongoose from "mongoose";
import { Validations, dateToMillis } from "../constants/common.js";

const ContactSchema = mongoose.Schema(
  {
    type: Validations(String, { required: true }),
    name: Validations(String), // Optional
    email: Validations(String), // Optional
    subject: Validations(String), // Optional
    phone: Validations(String, { required: true }), // Mandatory
    message: Validations(String), // Optional
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

export default mongoose.model("Contact", ContactSchema);