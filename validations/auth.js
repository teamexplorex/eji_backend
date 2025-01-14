import * as yup from "yup";

const loginUserDto = yup.object().shape({
  number: yup.string().required(),
});

const loginAdminUserDto = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const otpDto = yup.object().shape({
  otp: yup.number().required(),
  number: yup.string().required()
});

export const validateloginUser = async (req, res, next) => {
  try {
    let data = await loginUserDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const validateAdminloginUser = async (req, res, next) => {
  try {
    let data = await loginAdminUserDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const validateOtp = async (req, res, next) => {
  try {
    let data = await otpDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};