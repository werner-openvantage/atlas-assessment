import { type Request } from 'express';
import type User from '../models/user';

export interface RequestModel extends Request {
  user?: Partial<User>;
}
