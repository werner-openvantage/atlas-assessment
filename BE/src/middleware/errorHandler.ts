import { type NextFunction, type Request, type Response } from 'express';

import AuthenticationError from '@/errors/authenticationError';
import SqlError from '@/errors/sqlError';
import ClassValidationError from '@/errors/validationError';
import { AtlasError } from '@/types/error';

/**
 * Send a discord message with the error
 * @param {Error} err the error to send
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {NextFunction} next What to do next
 */
export default (
  err: AtlasError | ClassValidationError | AuthenticationError | SqlError | Error | null | undefined,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log(err);
  if (!err) {
    res.status(500).json({ message: 'Oops, sorry something went wrong' });
    return;
  }

  if (err instanceof ClassValidationError) {
    res.status(400).json({ err });
    return;
  }

  if (err instanceof SqlError) {
    res.status(err.status || 500).json({ message: err.message, sqlError: err.sqlError, stack: err.stack });
    return;
  }

  if (err instanceof AuthenticationError) {
    res.status(err.status || 403).json({ message: err.message, stack: err.stack });
    return;
  }

  if (err instanceof AtlasError) {
    res.status(err.status ?? 500).json({ message: err.message, stack: err.stack });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ message: err.message, stack: err.stack });
    return;
  }

  if (process.env.STAGE === 'prod') {
    res.status(500).json({ message: 'Oops, sorry something went wrong' });
    return;
  }

  res.status(500).json({ message: 'Oops, sorry something went wrong' });
};
