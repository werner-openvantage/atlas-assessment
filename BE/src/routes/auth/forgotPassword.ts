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

  // Look up the token in the database using the hash
  const Knex = db();
  const tempToken = await Knex('temp_token')
    .where('token', id) // Direct match since token IS the hash
    .where('type', 'forgot-password')
    .first();

  if (!tempToken) {
    throw new Error('Invalid or expired reset token');
  }

  // Check if token has expired
  const now = new Date();
  if (new Date(tempToken.expires_at) < now) {
    throw new Error('Reset token has expired');
  }

  // Now we need to get the email - it should be stored in the request context or we need another way
  // For now, we'll need to store email in metadata or use a mapping table
  // The simplest approach: store email as metadata when creating the token
  let email: string | null = null;

  // Try to parse email from data field if it exists
  if (tempToken.data && typeof tempToken.data === 'string') {
    try {
      const parsed = JSON.parse(tempToken.data);
      if (parsed.email) {
        email = parsed.email;
      }
    } catch (err) {
      console.error('Could not parse email from data field');
    }
  }

  if (!email) {
    throw new Error('Invalid token data - email not found');
  }

  // Get the user
  const user = await loginUser(email);

  if (!user?.id) {
    throw new Error('Invalid user data');
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userData = new User({
    password: hashedPassword,
  });

  await updateUser(userData, user.id);

  // Delete the token after use
  await deleteTempToken(tempToken.id);

  return {
    data: {
      success: true,
    },
  };
};

export default resetPassword;
