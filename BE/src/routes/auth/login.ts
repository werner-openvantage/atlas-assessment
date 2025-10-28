import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthenticationError from '@/errors/authenticationError';
import { loginUser } from '@controllers/auth';
import { Login, LoginParams, LoginResponse } from '@models/auth';
import { validateOrReject, ValidationError } from 'class-validator';
import ClassValidationError from '@/errors/validationError';
import { cleanErrors } from '@/utils/helpers/cleanErrors';

const JWT_SECRET = process.env.JWT_PRIVKEY as string;

const login = async (options: LoginParams): Promise<LoginResponse> => {
  const { body } = options;
  // Add VERIFY HERE
  if (!body) {
    throw new AuthenticationError('Invalid login details');
  }
  const data = new Login(body);
  await validateOrReject(data).catch((errors) => {
    throw new ClassValidationError('An issue Occurred during validation', cleanErrors(errors as ValidationError[]));
  });

  const user = await loginUser(data.email);
  if (!user) {
    throw new AuthenticationError('Invalid login details');
  }
  if (user.is_archived) {
    throw new AuthenticationError('User does not have access to the system');
  }

  if (!user.password) {
    throw new AuthenticationError('Invalid login details');
  }

  const match = await bcrypt.compareSync(data.password, user.password);
  if (!match) {
    throw new AuthenticationError('Invalid login details');
  }

  const userToken = {
    userId: user.id,
    organizationId: user.organization_id,
    type: user.is_super_admin ? 'super_admin' : 'user',
    is_archived: user.is_archived,
  };

  const token = jwt.sign(userToken, JWT_SECRET, {
    expiresIn: '1 days',
  });

  const retVal = {
    token,
    user: userToken,
    expiresIn: 1,
  };

  return {
    data: retVal,
  };
};

export default login;
