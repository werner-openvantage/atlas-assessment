/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Clear existing temp_token entries to remove duplicates from old implementation
  return knex('temp_token').truncate();
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // No rollback needed for truncate
  return Promise.resolve();
}
