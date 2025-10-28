import { updateUser as ctrlUpdateUser } from '@controllers/user';
import ClassValidationError from '@/errors/validationError';
import User, { type UserResponse } from '@models/user';
import { type ControllerParams } from '@ts-types/general-types';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import { validateOrReject, type ValidationError } from 'class-validator';
/**
 * Get all Users
 * @param {ControllerParams} options the query options
 * @returns {Promise<UserResponse>} an array of user objects
 */
const updateUser = async (options: ControllerParams): Promise<UserResponse> => {
  const { body, id } = options;
  if (!body || !id) {
    throw new Error('Invalid user data');
  }
  const data = new User(body);
  if (data.password) {
    delete data.password;
  }
  await validateOrReject(data, { skipMissingProperties: true }).catch((errors) => {
    throw new ClassValidationError('An issue Occurred during validation', cleanErrors(errors as ValidationError[]));
  });

  const user = await ctrlUpdateUser(data, id);
  return {
    data: user,
  };
};

export default updateUser;
