import * as Yup from "yup";

export const loginRegisterValidation = Yup.object({
  //email validation
  email: Yup.string()
    .max(50, "Email limit reached.")
    .email("Invalid Email")
    .required("Email is required."),

  //password validation
  password: Yup.string()
    .min(5, "Password must be greater than 6 characters.")
    .max(50, "Password limit reached.")
    .required("Password is required."),
});
