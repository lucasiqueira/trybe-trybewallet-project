import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from '../constants';

const validateFields = (email, password) => {
  const validations = [
    EMAIL_REGEX.test(email),
    password.length >= MIN_PASSWORD_LENGTH,
  ];
  return validations.every((validation) => validation === true);
};

export default validateFields;
