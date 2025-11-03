/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.table('temp_token', function(table) {
    table.jsonb('data').nullable().comment('Store additional data like email');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.table('temp_token', function(table) {
    table.dropColumn('data');
  });
}
