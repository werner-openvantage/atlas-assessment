import { type ValidationError } from 'class-validator';

/**
 * Clean the errors from the class-validator
 * @param {object} errors the errors to clean
 * @returns {object} the cleaned errors
 */
export const cleanErrors = (errors: ValidationError[]): Record<string, string> => {
  const retval: Record<string, string> = {};

  errors.forEach((error) => {
    let message = 'issue Occurred here';
    if (error?.constraints) {
      const keys = Object.keys(error.constraints);
      message = '';
      keys.forEach((key) => {
        if (error?.constraints?.[key]) {
          message += `${key}: `;
          message += error?.constraints[key];
        }
      });
    }
    retval[error.property] = message;
  });

  return retval;
};
