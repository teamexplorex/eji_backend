import * as yup from "yup";

const createCouponDto = yup.object().shape({
  name: yup
    .string()
    .trim()
    .uppercase()
    .required("Name is required")
    .matches(
      /^[A-Z0-9_]+$/,
      "Name must be uppercase and contain only letters, numbers, or underscores"
    ),
  amount: yup
    .number()
    .nullable()
    .test(
      "isPositive",
      "Amount must be positive",
      (value) => value === null || value >= 0
    ),
  isPercentage: yup.boolean().required("isPercentage is required"),
  minAmountPerPackage: yup
    .number()
    .nullable()
    .test(
      "isPositive",
      "Minimum amount per package must be positive",
      (value) => value === null || value >= 0
    ),
  maxEntry: yup
    .number()
    .required("Max entry is required")
    .positive("Max entry must be a positive number"),
  maxEntryPerUser: yup
    .number()
    .required("Max entry per user is required")
    .positive("Max entry per user must be a positive number"),
  isActive: yup.boolean().optional(),
});

export const validateCreateCoupon = async (req, res, next) => {
  try {
    let data = await createCouponDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCouponDto = yup.object().shape({
  name: yup
    .string()
    .trim()
    .uppercase()
    .optional()
    .matches(
      /^[A-Z0-9_]+$/,
      "Name must be uppercase and contain only letters, numbers, or underscores"
    ),
  amount: yup
    .number()
    .nullable()
    .test(
      "isPositive",
      "Amount must be positive",
      (value) => value === null || value >= 0
    ),
  isPercentage: yup.boolean().optional(),
  minAmountPerPackage: yup
    .number()
    .nullable()
    .test(
      "isPositive",
      "Minimum amount per package must be positive",
      (value) => value === null || value >= 0
    ),
  maxEntry: yup
    .number()
    .optional()
    .positive("Max entry must be a positive number"),
  maxEntryPerUser: yup
    .number()
    .optional()
    .positive("Max entry per user must be a positive number"),
  isActive: yup.boolean().optional(),
});

export const validateUpdateCoupon = async (req, res, next) => {
  try {
    let data = await updateCouponDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
