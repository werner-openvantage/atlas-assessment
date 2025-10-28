import knex, { type Knex } from 'knex';

let knexInstance: Knex;

/**
 * Get the Knex instance
 * @returns {Knex} the Knex instance
 */
const db = (): Knex => {
  if (!knexInstance) {
    if (process.env.STAGE === 'development') {
      knexInstance = knex({
        client: 'pg',
        connection: {
          connectionString: process.env.DATABASE_URL,
        },
        searchPath: ['atlas'],
        pool: {
          min: 2,
          max: 10,
        },
      });
    } else {
      knexInstance = knex({
        client: 'pg',
        connection: {
          connectionString: process.env.DATABASE_URL,
        },
        searchPath: ['atlas'],
        pool: {
          min: 2,
          max: 10,
        },
      });
    }
  }
  return knexInstance;
};

export default db;
