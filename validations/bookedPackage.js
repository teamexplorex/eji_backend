import * as yup from "yup";

const createBookedPackageDto = yup.object().shape({
  packageId: yup
    .string()
    .required("Package ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Package ID"),
  paidPrice: yup.number().required("Paid price is required"),
  travelDates: yup
    .array()
    .of(yup.date().required("Travel date is required"))
    .min(1, "At least one travel date is required")
    .required("Travel dates are required"),
  coupon: yup.object().shape({
    name: yup.string().optional(),
    isPercentage: yup.boolean().optional(),
    amount: yup.number().optional(),
  }),
  totalMrpAmount: yup.number().required("Total MRP amount is required"),
  discountedAmount: yup.number().optional(),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["CANCELLED", "BOOKED", "PENDING"], "Invalid status"),
  isWebhookEvent: yup.boolean().optional(),
  isRefunded: yup.boolean().optional(),
  userId: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
  orderId: yup
    .string()
    .required("Order ID is required")
    .matches(/^[A-Za-z0-9_-]+$/, "Invalid Order ID"),
});

export const validateCreateBookedPackage = async (req, res, next) => {
  try {
    const data = await createBookedPackageDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateBookedPackageDto = yup.object().shape({
  packageId: yup
    .string()
    .optional()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Package ID"),
  paidPrice: yup.number().optional(),
  travelDates: yup
    .array()
    .of(yup.date().optional())
    .min(1, "At least one travel date is required")
    .optional(),
  coupon: yup.object().shape({
    name: yup.string().optional(),
    isPercentage: yup.boolean().optional(),
    amount: yup.number().optional(),
  }),
  totalMrpAmount: yup.number().optional(),
  discountedAmount: yup.number().optional(),
  status: yup
    .string()
    .optional()
    .oneOf(["CANCELLED", "BOOKED"], "Invalid status"),
  isWebhookEvent: yup.boolean().optional(),
  isRefunded: yup.boolean().optional(),
  userId: yup
    .string()
    .optional()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
  orderId: yup
    .string()
    .optional()
    .matches(/^[A-Za-z0-9_-]+$/, "Invalid Order ID"),
});

export const validateUpdateBookedPackage = async (req, res, next) => {
  try {
    const data = await updateBookedPackageDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
