import { loginUser } from '@controllers/auth';
import { updateUser } from '@controllers/user';
import Error from '@/errors/authenticationError';
import ClassValidationError from '@/errors/validationError';
import { ResetPassword, type AuthResponse, type ResetPasswordParams } from '@models/auth';
import User from '@models/user';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import { deleteTempToken, getTempToken } from '@/utils/helpers/tempToken';
import bcrypt from 'bcryptjs';
import { validateOrReject, type ValidationError } from 'class-validator';

/**
 * Login user
 * @param {ResetPasswordParams} options login parameters
 * @returns {Promise<AuthResponse>} the user token
 */
const resetPassword = async (options: ResetPasswordParams): Promise<AuthResponse> => {
  const { body, id } = options;
  // Add VERIFY HERE
  if (!body) {
    throw new Error('Invalid data supplied');
  }
  if (!id) {
    throw new Error('Invalid data supplied');
  }
  const data = new ResetPassword(body);
  await validateOrReject(data).catch((errors) => {
    throw new ClassValidationError('An issue Occurred during validation', cleanErrors(errors as ValidationError[]));
  });

  const token = await getTempToken(id, 'forgot-password');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  if (token) {
    const {
      token: { email },
    } = token;

    if (!email) {
      throw new Error('Invalid user data');
    }

    const user = await loginUser(email as string);

    if (!user?.id) {
      throw new Error('Invalid user data');
    }

    const userData = new User({
      password: hashedPassword,
    });

    await updateUser(userData, user.id);
    await deleteTempToken(id);
  }

  return {
    data: {
      success: true,
    },
  };
};

export default resetPassword;
