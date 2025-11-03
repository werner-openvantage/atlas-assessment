import { emailExists } from '@controllers/user';
import Error from '@/errors/authenticationError';
import ClassValidationError from '@/errors/validationError';
import { ForgotPassword, type AuthResponse, type ForgotPasswordParams } from '@models/auth';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import { createTempToken } from '@/utils/helpers/tempToken';
import { sendEmail } from '@utils/mail';
import generateForgotPasswordEmail from '@/utils/mail-templates/forgotPassword';
import { validateOrReject, type ValidationError } from 'class-validator';
import dayjs from 'dayjs';
import db from '@/utils/knex';
import env from '@/utils/env';

/**
 * Login user
 * @param {ForgotPasswordParams} options login parameters
 * @returns {Promise<AuthResponse>} the user token
 */
const forgotPassword = async (options: ForgotPasswordParams): Promise<AuthResponse> => {
  const { body } = options;
  // Add VERIFY HERE
  if (!body) {
    throw new Error('Invalid data supplied');
  }

  const data = new ForgotPassword(body);
  await validateOrReject(data).catch((errors) => {
    throw new ClassValidationError('An issue Occurred during validation', cleanErrors(errors as ValidationError[]));
  });

  const exist = await emailExists(data.email);

  if (!exist) {
    return {
      data: {
        success: true,
      },
    };
  }

  // Create a unique hash-based token instead of storing email as JSON object
  // This makes it easier to handle duplicates and is more secure
  const crypto = await import('crypto');
  const emailHash = crypto.createHash('sha256').update(data.email).digest('hex');

  const token = await createTempToken({
    token: emailHash, // Store JUST the hash as the token for onConflict to work
    expires_at: dayjs().add(48, 'hour').toDate(),
    type: 'forgot-password',
    data: JSON.stringify({ email: data.email }), // Store email as JSON in data field
  } as any);

  // Use the emailHash in the URL
  const emailTemplate = generateForgotPasswordEmail({ url: `${env.FRONTEND_URL}/reset-password/${emailHash}` });

  await sendEmail(data.email, emailTemplate, 'Forgot Password');

  return {
    data: {
      success: true,
    },
  };
};

export default forgotPassword;
