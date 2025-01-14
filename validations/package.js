import * as yup from "yup";

const createPackageDto = yup.object().shape({
  name: yup.string().optional(),
  shortDescription: yup.string().optional(),
  longDescription: yup.string().optional(),
  stays: yup
    .array()
    .of(
      yup.object().shape({
        days: yup.number().optional(),
        nights: yup.number().optional(),
        cityName: yup.string().optional(),
      })
    )
    .optional(),
  actualPrice: yup.number().optional(),
  discountedPrice: yup.number().optional(),
  totalNights: yup.number().optional(),
  type: yup.string().optional().oneOf(["PACKAGE", "EXPERIENCE"], "Invalid type. Must be PACKAGE or EXPERIENCE"),
  slug: yup
    .string()
    .optional()
    .matches(/^[a-z0-9-]+$/, "Slug must be alphanumeric and lowercase"),
  totalDays: yup.number().optional(),
  isFlightIncluded: yup.boolean().optional(),
  tags: yup.array().of(yup.string()).optional(),
  shortMainCardImage: yup.string().optional(),
  images: yup.array().of(yup.string()).optional(),
  packageItinerary: yup
    .array()
    .of(
      yup.object().shape({
        day: yup.number().optional(),
        description: yup.string().optional(),
        images: yup.array().of(yup.string()).optional(), 
      })
    )
    .optional(),
  tourValidity: yup.string().optional(),
  inclusions: yup.array().of(yup.string()).optional(),
  exclusions: yup.array().of(yup.string()).optional(),
  termsAndConditions: yup.string().optional(),
  travelEssentials: yup.array().of(yup.string()).optional(),
});

export const validateCreatePackage = async (req, res, next) => {
  try {
    let data = await createPackageDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePackageDto = yup.object().shape({
  name: yup.string().optional(),
  shortDescription: yup.string().optional(),
  longDescription: yup.string().optional(),
  stays: yup
    .array()
    .of(
      yup.object().shape({
        days: yup.number().optional(),
        nights: yup.number().optional(),
        cityName: yup.string().optional(),
      })
    )
    .optional(),
  actualPrice: yup.number().optional(),
  discountedPrice: yup.number().optional(),
  totalNights: yup.number().optional(),
  slug: yup.string().optional(),
  totalDays: yup.number().optional(),
  isFlightIncluded: yup.boolean().optional(),
  tags: yup.array().of(yup.string()).optional(),
  shortMainCardImage: yup.string().optional(),
  images: yup.array().of(yup.string()).optional(),
  type: yup.string().optional().oneOf(["PACKAGE", "EXPERIENCE"], "Invalid type. Must be PACKAGE or EXPERIENCE"),
  packageItinerary: yup
    .array()
    .of(
      yup.object().shape({
        day: yup.number().optional(),
        description: yup.string().optional(),
        images: yup.array().of(yup.string()).optional(),
      })
    )
    .optional(),
  tourValidity: yup.string().optional(),
  inclusions: yup.array().of(yup.string()).optional(),
  exclusions: yup.array().of(yup.string()).optional(),
  termsAndConditions: yup.string().optional(),
  travelEssentials: yup.array().of(yup.string()).optional(),
});

export const validateUpdatePackage = async (req, res, next) => {
  try {
    let data = await updatePackageDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
