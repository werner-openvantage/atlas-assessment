import type { AnyValue } from '@ts-types/general-types';

/**
 * Check if the value is null or undefined
 * @param {AnyValue} value the value to check
 * @returns {boolean} the result of the check
 */
const notNull = (value: AnyValue): boolean => {
  return value !== null && value !== undefined && value !== 'null' && value !== 'undefined';
};

export default notNull;
