/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generic validator
type Validations = { [key: string]: boolean };
const validator = (validations: Validations) => Object.values(validations).every((validation) => validation);

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

const isSecurePassword = (password: string) => {
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

const isValidEmail = (email: string) => {
  return validator(emailValidations(email));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const phoneValidations = (phoneNumber: string) => ({
  isPhoneNumber: /^\d{10}$/.test(phoneNumber)
});

const isPhoneNumber = (phoneNumber: string) => {
  return validator(phoneValidations(phoneNumber));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const nameValidations = (name: string) => {
  return {
    hasMinLength: name.length >= 3,
    hasMaxLength: name.length <= 30,
    onlyLettersOrSpaces: /^[a-zA-Z\s]*$/.test(name)
  };
}

const isAName = (name: string) => {
  return validator(nameValidations(name));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const dniValidations = (dni: string) => ({
  isNumber: /^\d+$/.test(dni),
  hasMinLength: dni.length >= 7,
  hasMaxLength: dni.length <= 9
});

const isDNI = (dni: string) => {
  return validator(dniValidations(dni));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO: Mejorar
interface Address {
  street: string;
  number: number;
  city: string;
  country: string;
}

interface AddressValidator {
  (address: Address): {
    isStreet: boolean;
    isNumber: boolean;
    isCity: boolean;
    isCountry: boolean;
  };
}

const addressValidations: AddressValidator = (address) => ({
  isStreet: address.street.length > 0 && address.street.length < 100,
  isNumber: address.number > 0 && address.number < 10000,
  isCity: ['BA', 'MDP'].includes(address.city),
  isCountry: ['AR'].includes(address.country)
});

const isAddress= (address: Address) => {
  return validator(addressValidations(address));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const FormValidators = {
  isSecurePassword,
  isValidEmail,
  isPhoneNumber,
  isAName,
  isDNI,
  isAddress
}
