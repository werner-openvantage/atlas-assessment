import { AtlasError } from "@ts-types/error";

/**
 *
 */
export default class SqlError extends AtlasError {
  sqlError: unknown;
  /**
   *
   */
  constructor(message = 'SQL Error', status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
