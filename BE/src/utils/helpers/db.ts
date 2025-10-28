import { type Filter } from '@ts-types/general-types';
import type QueryOptions from '@ts-types/query-options';
import { type Knex } from 'knex';

/**
 *
 * @param {QueryOptions} options the query options
 * @param {string[]} searchableFields the fields to search on
 * @param {Knex} knex the knex instance
 * @returns {Knex} knex where the queries were added on
 */
export const buildWhere = (
  options: QueryOptions,
  searchableFields: string[],
  knex: Knex.QueryBuilder,
): Knex.QueryBuilder => {
  const { filter } = options;
  if (filter) {
    const where: Filter[] = Array.isArray(filter) ? filter : [filter];
    if (where.length > 0) {
      where.forEach((filter) => {
        const { name, filter: filterInfo } = filter;
        const { type, values } = filterInfo;
        switch (type) {
          case 'IN':
            void knex.whereRaw(`${name} IN (?)`, values);
            break;
          case 'GREATERTHANEQ':
            void knex.whereRaw(`${name} >= ?`, values);
            break;
          case 'LESSTHANEQ':
            void knex.whereRaw(`${name} <= ?`, values);
            break;
          case 'GREATERTHAN':
            void knex.whereRaw(`${name} > ?`, values);
            break;
          case 'LESSTHAN':
            void knex.whereRaw(`${name} < ?`, values);
            break;
          case 'BETWEEN':
            void knex.whereRaw(`${name} BETWEEN ? and ?`, values);
            break;
          case 'EQ':
            void knex.where(name, values);
            break;
          case 'NOTEQ':
            void knex.whereNot(name, values);
            break;
          case 'UPPER':
            void knex.whereRaw(`UPPER(${name}) = UPPER(?)`, values);
            break;
          default:
            break;
        }
      });
    }
  }
  if (options.search && searchableFields.length > 0) {
    void knex.where((builder) => {
      searchableFields.forEach((field) => {
        void builder.orWhereRaw(`${field} ILIKE ?`, [`%${options.search}%`]);
      });
    });
  }
  return knex;
};

/**
 * Build the pagination for the query
 * @param {QueryOptions} pagination the pagination options
 * @param {Knex} knex the knex instance
 * @returns {Knex} knex with the pagination added
 */
export const buildPagination = (pagination: QueryOptions, knex: Knex.QueryBuilder): Knex.QueryBuilder => {
  if (pagination.limit) {
    void knex.limit(Number(pagination.limit));
  }
  if (pagination.skip) {
    void knex.offset(Number(pagination.skip));
  }
  if (pagination.sort) {
    const [field, order] = pagination.sort.split(':');
    void knex.orderBy(field, order);
  }
  return knex;
};

/**
 * Creates a valid filter for db queries
 * @param {object} filters filters object
 * @returns {object} valid filters
 */
export const createValidFilter = (filters: Filter | Filter[] | undefined): Record<string, unknown> => {
  const validFilter: Record<string, unknown> = {};
  if (!filters) {
    return validFilter;
  }
  if (!Array.isArray(filters)) {
    filters = [filters];
  }
  filters.forEach((filter) => {
    validFilter[filter.name] = filter.filter.values;
  });
  return validFilter;
};

/**
 * Creates a valid filter for db queries
 * @param {object} filters filters object
 * @param {object} cleanedFilter cleaned filter object
 * @returns {object} valid filters
 */
export const buildFilter = <T>(filters: Filter | Filter[] | undefined, cleanedFilter: T): Filter[] => {
  const validFilter: Filter[] = [];
  if (!filters) {
    return validFilter;
  }
  if (!Array.isArray(filters)) {
    filters = [filters];
  }
  filters.forEach((filter) => {
    const hasProperty = Object.prototype.hasOwnProperty.call(cleanedFilter, filter.name);
    if (hasProperty) {
      // @ts-expect-error At the moment I do not know how to get past this. Will figure it out soon
      if (cleanedFilter[filter.name] !== undefined) {
        validFilter.push(filter);
      }
    }
  });
  return validFilter;
};
