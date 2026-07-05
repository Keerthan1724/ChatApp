const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
const GLOBAL_MOBILE_REGEX = /^[0-9]{10}$/;
const OTP_REGEX = /^\d{6}$/;

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const validateCreateAccount = (values) => {
  const errors = {};

  if (!values.full_name?.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "Enter a valid email.";
  }

  if (!values.mobile_number?.trim()) {
    errors.mobile_number = "Mobile number is required.";
  } else if (!INDIAN_MOBILE_REGEX.test(values.mobile_number)) {
    errors.mobile_number = "Enter a valid 10 digit mobile number.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Confirm your password.";
  } else if (values.password && values.password !== values.confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
};

export const validateEmailOTP = (otp) => {
  const errors = {};

  if (!otp?.trim()) {
    errors.otp = "Verification code is required.";
  } else if (!OTP_REGEX.test(otp)) {
    errors.otp = "Enter a valid 6-digit verification code.";
  }

  return errors;
};

export const validateEmail = (email) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email.";
  }

  return errors;
};

export const validateProfileImage = (file) => {
  if (!file) return "";

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG and WEBP images are allowed.";
  }

  if (file.size > MAX_SIZE) {
    return "Image size must be less than 5MB.";
  }

  return "";
};

export const validateLogin = (values) => {
  const errors = {};
  const identifier = values.email ? values.email.trim() : "";

  if (!identifier) {
    errors.email = "Email or mobile number is required.";
  } else if (
    !EMAIL_REGEX.test(identifier) &&
    !GLOBAL_MOBILE_REGEX.test(identifier)
  ) {
    errors.email = "Enter a valid email address or 10-digit mobile number.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateResetPassword = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Password is required.";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Confirm your password.";
  } else if (values.password && values.password !== values.confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
};
