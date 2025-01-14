import yup from "yup";

export const EPOCH = {
  ONE_MINUTE_MS: 60 * 1000,
  ONE_SECOND_MS: 1000,
  ONE_HOUR_MS: 60 * 60 * 1000,
  ONE_DAY_MS: 24 * 60 * 60 * 1000,
  ONE_MONTH_MS: 30 * 24 * 60 * 60 * 1000,
  INDIAN_TIMEZONE_OFFSET_MS: 5 * 60 * 60 * 1000 + 30 * 60 * 1000,
};

export const ROLE = {
  ADMIN: "ADMIN",
  USER: "USER"
};

export const objectIdValidation = yup
  .mixed()
  .nullable()
  .test("is-object-id", "Invalid ObjectId", (value) => {
    try {
      if (value === undefined || value === null || value === "") return true;
      mongoose.Types.ObjectId(value);
      return true;
    } catch (err) {
      return false;
    }
  });

export const dateToMillis = (date) => (date ? date.getTime() : null);

export const Validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};
