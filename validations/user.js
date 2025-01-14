import * as yup from "yup";

const updateUserDto = yup.object().shape({
  name: yup.string().optional(),
  number: yup.string().optional(),
  email: yup.string().email("Invalid email").optional(),
  role: yup.string().optional(),
  otpCount: yup.number().optional(),
  otpCountUpdatedAt: yup.number().optional(),
  adminAccess: yup.array().of(yup.string()).optional(),
  isBlock: yup.boolean().optional(),
  isActive: yup.boolean().optional(),
  tokenVersion: yup.number().optional(),
  isOnboardingCompleted: yup.boolean().optional(),
  password: yup.string().optional(),
});

export const validateUpdateUser = async (req, res, next) => {
  try {
    let data = await updateUserDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createUserDto = yup.object().shape({
  name: yup.string().required(),
  number: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().email("Invalid email").required(),
  adminAccess: yup.array().of(yup.string()).required()
});

export const validateCreateUser = async (req, res, next) => {
  try {
    let data = await createUserDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}