import type { NextFunction, Response } from 'express';
import type { RequestModel } from './request';
import type QueryOptions from './query-options';
import type User from '@models/user';
import type { ResponseModel } from './response-model';

type FilterType =
  | 'IN'
  | 'GREATERTHANEQ'
  | 'LESSTHANEQ'
  | 'GREATERTHAN'
  | 'LESSTHAN'
  | 'BETWEEN'
  | 'EQ'
  | 'NOTEQ'
  | 'UPPER';

type AnyValue = string | number | boolean | undefined | null | Date | object;

interface FilterInfo {
  type: FilterType;
  values: AnyValue | AnyValue[];
}

interface Filter {
  name: string;
  filter: FilterInfo;
}

interface TempToken {
  expires_at: Date;
  token: Record<string, string | boolean | number>;
  type: string;
  id?: string;
}

interface ControllerParams {
  id?: string;
  organization_id?: string;
  organizationId?: string;
  body?: object;
  query?: QueryOptions;
  user?: Partial<User>;
  type?: string;
}

type Params = (req: RequestModel) => ControllerParams;
type PromiseFunction = (params: T) => Promise<ResponseModel>;
type ResponseFunction = (req: RequestModel, res: Response, next: NextFunction) => void;
