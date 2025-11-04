import { loginUser } from '@controllers/auth';
import { updateUser } from '@controllers/user';
import Error from '@/errors/authenticationError';
import ClassValidationError from '@/errors/validationError';
import { ResetPassword, type AuthResponse, type ResetPasswordParams } from '@models/auth';
import User from '@models/user';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import { deleteTempToken } from '@/utils/helpers/tempToken';
import bcrypt from 'bcryptjs';
import { validateOrReject, type ValidationError } from 'class-validator';
import db from '@/utils/knex';

/**
 * Reset password with token
 * @param {ResetPasswordParams} options reset password parameters
 * @returns {Promise<AuthResponse>} success response
 */
const resetPassword = async (options: ResetPasswordParams): Promise<AuthResponse> => {
  const { body, id } = options;

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

  const Knex = db();
  const tempToken = await Knex('temp_token')
    .where('token', id)
    .where('type', 'forgot-password')
    .first();

  if (!tempToken) {
    throw new Error('Invalid or expired reset token');
  }

  const now = new Date();
  if (new Date(tempToken.expires_at) < now) {
    throw new Error('Reset token has expired');
  }

  let email: string | null = null;

  if (tempToken.data) {
    try {
      const tokenData = typeof tempToken.data === 'string' ? JSON.parse(tempToken.data) : tempToken.data;
      if (tokenData && tokenData.email) {
        email = tokenData.email;
      }
    } catch (err) {
      console.error('Could not parse email from data field', err);
    }
  }

  if (!email) {
    throw new Error('Invalid token data - email not found');
  }

  const user = await loginUser(email);

  if (!user?.id) {
    throw new Error('Invalid user data');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = new User({
    password: hashedPassword,
  });

  await updateUser(userData, user.id);

  await deleteTempToken(tempToken.id);

  return {
    data: {
      success: true,
    },
  };
};

export default resetPassword;
