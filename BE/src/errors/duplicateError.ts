import { AtlasError } from '@ts-types/error';

/**
 *
 */
export default class DuplicateError extends AtlasError {
  /**
   *
   */
  constructor(message = 'Duplicate Entry', status = 409) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
