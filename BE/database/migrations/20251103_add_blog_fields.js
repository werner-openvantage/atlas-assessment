/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.table('posts', function(table) {
    table.string('heading').nullable();
    table.string('image_url').nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.table('posts', function(table) {
    table.dropColumn('heading');
    table.dropColumn('image_url');
  });
}
