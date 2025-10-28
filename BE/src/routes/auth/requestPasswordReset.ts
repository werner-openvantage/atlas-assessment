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

  const token = await createTempToken({
    token: { email: data.email },
    expires_at: dayjs().add(48, 'hour').toDate(),
    type: 'forgot-password',
  });

  const emailTemplate = generateForgotPasswordEmail({ url: `${process.env.FRONTEND_URL}/reset-password/${token}` });

  await sendEmail(data.email, emailTemplate, 'Forgot Password');

  return {
    data: {
      success: true,
    },
  };
};

export default forgotPassword;
