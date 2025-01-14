import * as yup from "yup";

const createContactDto = yup.object().shape({
  type: yup.string().required("Type is required"),
  name: yup.string().optional(),
  email: yup.string().email("Invalid email").optional(),
  subject: yup.string().optional(),
  phone: yup.string().required("Phone is required"),
  message: yup.string().optional(),
});

export const validateCreateContact = async (req, res, next) => {
  try {
    let data = await createContactDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateContactDto = yup.object().shape({
  type: yup.string().optional(),
  name: yup.string().optional(),
  email: yup.string().email("Invalid email").optional(),
  subject: yup.string().optional(),
  phone: yup.string().optional(),
  message: yup.string().optional(),
});

export const validateUpdateContact = async (req, res, next) => {
  try {
    let data = await updateContactDto.validate(req.body);
    req.body = data;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
