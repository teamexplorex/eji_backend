import mongoose from "mongoose";
import { Validations, dateToMillis } from "../constants/common.js";

// Define the OtpSchema
const OtpSchema = mongoose.Schema({
  otp: Validations(Number, { required: true }),
  number: Validations(String, { required: true }),
  expires: { type: Date, default: Date.now, index: { expires: '3m' } }, 
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
});

// Create and export the model
export default mongoose.model("Otp", OtpSchema);
