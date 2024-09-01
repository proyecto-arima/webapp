/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generic validator
const validator = (validations: any) => Object.values(validations).every((validation) => validation);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface PasswordValidations {
  (password: string): {
    hasMinLength: boolean;
    hastAtLeastOneEspecialCharacter: boolean;
    hasNumbers: boolean;
    hasAtLeastOneUppercase: boolean;
  };
}

const passwordValidations: PasswordValidations = (password) => ({
  hasMinLength: password.length >= 8,
  hastAtLeastOneEspecialCharacter: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password),
  hasNumbers: /[0-9]+/.test(password),
  hasAtLeastOneUppercase: /[A-Z]+/.test(password)
});

export const isSecurePassword = (password: string) => {
  return validator(passwordValidations(password));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface EmailValidator {
  (email: string): {
    isEmail: boolean;
  };
}

const emailValidations: EmailValidator = (email) => ({
  isEmail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)
});

export const isValidEmail = (email: string) => {
  return validator(emailValidations(email));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface PhoneNumberValidator {
  (phoneNumber: string): {
    isPhoneNumber: boolean;
    // isFromAR: boolean;
  };
}

export const isPhoneNumber = (phoneNumber: string) => {
  return /^\d{10}$/.test(phoneNumber);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const isDNI = (dni: string) => {
  return /^\d{8}$/.test(dni);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////