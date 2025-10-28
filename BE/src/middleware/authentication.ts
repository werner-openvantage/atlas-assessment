import type express from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../errors/authenticationError';
import { type RequestModel } from '../types/request';
import { UserResponse } from '../models/user';
import notNull from '../utils/helpers/notNull';
import { getUser } from '@controllers/user';

const JWT_SECRET: string = process.env.JWT_PRIVKEY ?? '';

/**
 * Authentication middleware
 * @param {string[]} permissions the permissions to check
 * @param {boolean} satisfyAll should all permissions be satisfied
 * @returns {AuthenticationFunction} the authentication function
 */
const Authentication =
  (permissions: string[] | undefined = undefined, satisfyAll = true) =>
  /**
   * Authentication layer
   * @param {express.Request} req the request object
   * @param {express.Response} res the response object
   * @param {express.NextFunction} next the next function
   */
  (req: RequestModel, res: express.Response, next: express.NextFunction): void => {
    const { headers } = req;
    if (!notNull(headers?.authorization)) {
      throw new AuthenticationError('Invalid token');
    }

    const token = headers?.authorization?.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Invalid token');
    }

    try {
      const user = jwt.verify(token ?? '', JWT_SECRET) as unknown as {
        userId?: string;
        organizationId?: string;
        type?: string;
        is_archived?: boolean;
      };
      console.log('user: ', user);
      if (!user?.userId) {
        throw new AuthenticationError('Session expired, please login again.');
      }
      getUser(user.userId, [
        'users.id',
        'users.email'
      ])
        .then(async (result: UserResponse) => {
          if (!result?.data?.id || result?.data?.is_archived) {
            throw new AuthenticationError('Session expired, please login again.');
          }

          req.user = result.data;
          next();
        })
        .catch((err: unknown) => {
          next(err ?? new AuthenticationError('Session expired, please login again.'));
        });
    } catch (err: unknown) {
      if (err instanceof Error) {
        next(new AuthenticationError(err.name === 'TokenExpiredError' ? 'Expired token' : 'Invalid token'));
      } else {
        next(new AuthenticationError('Invalid token'));
      }
    }
  };

export default Authentication;
