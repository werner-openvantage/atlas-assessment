// Update with your config settings.
const migrationSource = {
  /**
   *
   * @param {string} name name of the migration
   * @returns {string} the name of the migration file
   */
  getMigrationName: (name) => {
    return `${+new Date()}-${name}.js`;
  },
};

const config = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  searchPath: ['atlas'],
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    schemaName: 'atlas',
    extension: 'js',
    directory: './database/migrations',
    migrationSource,
  },
  seeds: {
    directory: './database/seeds',
  },
};

export default config;
