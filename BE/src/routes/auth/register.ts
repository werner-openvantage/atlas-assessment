import { default as AuthenticationError, default as Error } from '@/errors/authenticationError';
import ClassValidationError from '@/errors/validationError';
import env from '@/utils/env';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import generateForgotPasswordEmail from '@/utils/mail-templates/forgotPassword';
import generateWelcomeEmail from '@/utils/mail-templates/welcomeEmail';
import { createUser, emailExists } from '@controllers/user';
import { Register, RegisterParams, type AuthResponse } from '@models/auth';
import User from '@/models/user';
import { sendEmail } from '@utils/mail';
import bcrypt from 'bcryptjs';
import { validateOrReject, type ValidationError } from 'class-validator';

/**
 * Login user
 * @param {RegisterParams} options login parameters
 * @returns {Promise<AuthResponse>} the user token
 */
const registerUser = async (options: RegisterParams): Promise<AuthResponse> => {
  try {
    console.log("REGISTER OPTIONS:", options);

    const { body } = options;
    if (!body) throw new Error('Invalid data supplied');

    console.log("BODY:", body);

    const data = new Register(body);
    await validateOrReject(data).catch((errors) => {
      console.log("VALIDATION ERRORS:", errors);
      throw new ClassValidationError('An issue occurred during validation', cleanErrors(errors as ValidationError[]));
    });

    console.log("VALIDATION PASSED");

    const exist = await emailExists(data.email);
    console.log("EMAIL EXISTS:", exist);

    if (exist) {
      throw new AuthenticationError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log("PASSWORD HASHED");

    const user = await createUser(
      new User({
        email: data.email,
        password: hashedPassword,
        first_name: data.firstName,
        last_name: data.lastName,
        is_archived: false,
      })
    );

    console.log("USER CREATED:", user);

    const emailTemplate = generateWelcomeEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      url: `${process.env.FRONTEND_URL || env.CORS_ORIGIN}/login`,
    });

    // Send email asynchronously without blocking registration
    sendEmail(data.email, emailTemplate, 'Welcome to the Atlas Portal')
      .then(() => console.log("EMAIL SENT"))
      .catch((err) => console.error("EMAIL SEND FAILED:", err));

    return { data: { success: true } };
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    throw err;
  }
};


export default registerUser;
