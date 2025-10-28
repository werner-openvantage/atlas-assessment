/**
 *
 */
export class AtlasError extends Error {
  status: number;
  /**
   *
   */
  constructor(message = 'Atlas Server error', status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
