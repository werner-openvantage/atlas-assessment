import SqlError from '@/errors/sqlError';
import type {
  Filter,
  AnyValue,
  Params,
  ResponseFunction,
  PromiseFunction,
  ControllerParams,
} from '@ts-types/general-types';
import type { RequestModel } from '@ts-types/request';
import type { NextFunction, Response } from 'express';
import notNull from './notNull';
import type QueryOptions from '@ts-types/query-options';
import type { ResponseModel } from '@ts-types/response-model';

/**
 * Validating the values of the filter
 * @param {AnyValue | AnyValue[]} values the value to validate
 * @returns {AnyValue | AnyValue[]} the validated value
 */
const validateValues = (values: AnyValue | AnyValue[]): AnyValue | AnyValue[] => {
  if (Array.isArray(values)) {
    return values.map((filta: AnyValue) => validateValues(filta) as AnyValue);
  }
  if (values === 'true' || values === 'false') {
    return values === 'true';
  }
  return notNull(values) ? values : null;
};

/**
 * Create the filter object
 * @param {string} filter the filter to create
 * @returns {Filter | null} the filter object
 */
const createFilterObject = (filter: string): Filter | null => {
  if (!filter) {
    return null;
  }
  const [fieldName, fieldValue] = filter.split('=');
  if (fieldName.includes('$in')) {
    const inValues = fieldValue.split(',');
    return {
      name: fieldName.replace('$in', ''),
      filter: {
        type: 'IN',
        values: validateValues(inValues),
      },
    };
  }
  if (fieldName.includes('$gte')) {
    return {
      name: fieldName.replace('$gte', ''),
      filter: {
        type: 'GREATERTHANEQ',
        values: validateValues(fieldValue),
      },
    };
  }
  if (fieldName.includes('$lte')) {
    return {
      name: fieldName.replace('$lte', ''),
      filter: {
        type: 'LESSTHANEQ',
        values: validateValues(fieldValue),
      },
    };
  }
  if (fieldName.includes('$gt')) {
    return {
      name: fieldName.replace('$gt', ''),
      filter: {
        type: 'GREATERTHAN',
        values: validateValues(fieldValue),
      },
    };
  }
  if (fieldName.includes('$lt')) {
    return {
      name: fieldName.replace('$lt', ''),
      filter: {
        type: 'LESSTHAN',
        values: validateValues(fieldValue),
      },
    };
  }
  if (fieldName.includes('$btw')) {
    const betweenValues = fieldValue.split(',');
    if (betweenValues.length !== 2) {
      throw new SqlError('There can only be 2 values for between. i.e. dd-mm-yyyy,dd-mm-yyyy');
    }
    return {
      name: fieldName.replace('$btw', ''),
      filter: {
        type: 'BETWEEN',
        values: validateValues(betweenValues),
      },
    };
  }
  if (fieldName.includes('$ne')) {
    return {
      name: fieldName.replace('$ne', ''),
      filter: {
        type: 'NOTEQ',
        values: validateValues(fieldValue),
      },
    };
  }
  if (fieldName.includes('$eq')) {
    return {
      name: fieldName.replace('$eq', ''),
      filter: {
        type: 'EQ',
        values: validateValues(fieldValue),
      },
    };
  }
  if (fieldName.includes('$up')) {
    return {
      name: fieldName.replace('$up', ''),
      filter: {
        type: 'UPPER',
        values: validateValues(fieldValue),
      },
    };
  }
  return null;
};

/**
 * Create the filters object that will be sent to the database
 * @param {RequestModel} req the request object
 * @param {string} path the path of the request
 * @param {ControllerParams} boundParams path parameters
 * @returns {Filter[]} the filters object
 */
const createFilters = (req: RequestModel, path: string, boundParams: ControllerParams): Filter[] => {
  let reqFilters: string[] = [];

  if (!Array.isArray(req.query.filter)) {
    reqFilters = [req.query.filter as string];
  }

  const filters = [];
  let archivedFound = false;
  let companyFound = false;
  reqFilters.forEach((filter) => {
    const filterItem = createFilterObject(filter);
    if (filterItem) {
      filters.push(filterItem);
      if (filterItem.name === 'is_archived') {
        archivedFound = true;
      }
      if (filterItem.name === 'organization_id') {
        companyFound = true;
      }
    }
  });

  if (!archivedFound && req.user) {
    const filter: Filter = {
      name: 'is_archived',
      filter: {
        type: 'EQ',
        values: false,
      },
    };
    filters.push(filter);
  }
  // TODO will this work for all?
  if (!companyFound && (boundParams.organization_id ?? boundParams.organizationId)) {
    const filter: Filter = {
      name: 'organization_id',
      filter: {
        type: 'EQ',
        values: boundParams.organization_id ?? boundParams.organizationId,
      },
    };
    filters.push(filter);
  }

  return filters;
};

/**
 * Check if the sort options are valid
 * @param {string} sort the sort options
 * @returns {boolean} the result of the check
 */
const validSort = (sort: string): boolean => {
  if (!sort) {
    return false;
  }
  if (sort.includes(' ')) {
    return false;
  }
  if (sort.includes('-')) {
    return false;
  }
  if (sort.split('').filter((char) => Number.isNaN(char)).length > 0) {
    return false;
  }
  return true;
};

/**
 * Check if the pagination options are valid
 * @param {AnyValue} value the value to check
 * @returns {boolean} the result of the check
 */
const validPagination = (value: AnyValue): boolean => !Number.isNaN(value) && !!value;

/**
 * Handles controller execution and responds to front-end (API Express version).
 * Web socket has a similar handler implementation.
 * @param {Promise} promise Controller Promise. I.e. getById.
 * @param {Function} params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
 * @returns {Function} A function that handles the request and response of the API.
 */
const controller = (promise: PromiseFunction, params?: Params): ResponseFunction => {
  return (req: RequestModel, res: Response, next: NextFunction): void => {
    try {
      const boundParams = params ? params(req) : {};
      if (req.method === 'GET') {
        const options: QueryOptions = {
          sort: validSort(req.query.sort?.toString() ?? '') ? req.query.sort?.toString() : '',
          skip: validPagination(req.query.skip) ? req.query.skip?.toString() : '0',
          limit: validPagination(req.query.limit) ? req.query.limit?.toString() : '50',
        };


        if (!req.query.filter) {
          req.query.filter = '';
        }
        options.filter = createFilters(req, req.path, boundParams);

        if (req.query.search && typeof req.query.search === 'string') {
          options.search = req.query.search.toString();
        }

        boundParams.query = options;
      }

      if (req.method === 'POST') {
        const user = req.user;
        if (!req.body.organization_id && user) {
          req.body.organization_id = user.organization_id;
        }
      }

      if (req.user) {
        boundParams.user = req.user;
      }

      promise(boundParams)
        .then((result) => {
          if (result === null) {
            const response: ResponseModel = { data: result };
            res.status(200).json(response);
          } else if (result) {
            const response: ResponseModel = {
              data: result.data !== undefined ? result.data : result,
              count: result.count,
            };
            res.status(200).json(response);
          } else {
            res.status(200).json({ message: 'OK' });
          }
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  };
};

export default controller;
