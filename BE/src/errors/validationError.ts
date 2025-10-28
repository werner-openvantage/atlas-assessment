import { AtlasError } from '@ts-types/error';

/**
 *
 */
export default class ClassValidationError extends AtlasError {
  errors: Record<string, string> | string | undefined;
  /**
   *
   */
  constructor(
    message = 'Validation failed',
    errors: Record<string, string> | string | undefined = undefined,
    status = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.errors = errors;
  }
}
