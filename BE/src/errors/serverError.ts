import { AtlasError } from "@ts-types/error";

export default class ServerError extends AtlasError {
  status: number;

  constructor(message = 'Server Error', status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
