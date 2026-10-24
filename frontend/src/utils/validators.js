/**
 * Validation helpers used across auth forms and pet profile forms.
 * Each function returns an error message string, or "" if the value is valid.
 */

export function validateEmail(email) {
  if (!email?.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

export function validateName(name) {
  if (!name?.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters long.";
  return "";
}

export function validatePetName(name) {
  if (!name?.trim()) return "Pet name is required.";
  return "";
}

export function validatePositiveNumber(value, fieldLabel = "This field") {
  if (value === "" || value === null || value === undefined) return ""; // optional field
  const num = Number(value);
  if (isNaN(num) || num < 0) return `${fieldLabel} must be a positive number.`;
  return "";
}

export function validateChatMessage(message) {
  if (!message?.trim()) return "Please type a message before sending.";
  if (message.length > 2000) return "Message is too long. Please keep it under 2000 characters.";
  return "";
}

/**
 * Runs a set of validators (field -> validator function) against a form object.
 * Returns an object of { field: errorMessage } for only the fields that failed.
 *
 * Usage:
 *   const errors = validateForm(form, {
 *     email: (v) => validateEmail(v.email),
 *     password: (v) => validatePassword(v.password),
 *   });
 *   if (Object.keys(errors).length > 0) { ... }
 */
export function validateForm(form, validatorMap) {
  const errors = {};
  for (const field in validatorMap) {
    const message = validatorMap[field](form);
    if (message) errors[field] = message;
  }
  return errors;
}
