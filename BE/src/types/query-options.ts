import type { Filter } from './general-types';

interface QueryOptions {
  filter?: Filter | Filter[];
  limit?: string;
  skip?: string;
  sort?: string;
  search?: string;
}

export default QueryOptions;
