import { AtlasError } from '@ts-types/error';

/**
 *
 */
export default class AuthenticationError extends AtlasError {
  /**
   *
   */
  constructor(message = 'Authentication failed', status = 401) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
