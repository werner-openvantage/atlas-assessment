/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('temp_token', function(table) {
    table.increments('id').primary();
    table.string('token').notNullable().unique();
    table.string('type').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('temp_token');
}
