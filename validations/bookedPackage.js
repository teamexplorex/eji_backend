import * as yup from "yup";

const createBookedPackageDto = yup.object().shape({
  packageId: yup
    .string()
    .required("Package ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Package ID"),
  departureDate: yup.string().optional(),
  coupon: yup.object().shape({
    name: yup.string().optional(),
    isPercentage: yup.boolean().optional(),
    amount: yup.number().optional(),
  }),
  userId: yup
    .string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid User ID"),
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
  departureDate: yup.string().optional(),
  coupon: yup.object().shape({
    name: yup.string().optional(),
    isPercentage: yup.boolean().optional(),
    amount: yup.number().optional(),
  }),
  status: yup
    .string()
    .optional()
    .oneOf(["CANCELLED", "BOOKED", "PENDING"], "Invalid status"),
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
