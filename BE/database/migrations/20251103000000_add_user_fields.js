/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('first_name').nullable();
    table.string('middle_name').nullable();
    table.string('last_name').nullable();
    table.string('title').nullable();
    table.boolean('is_archived').defaultTo(false);
    table.boolean('is_super_admin').defaultTo(false);
    table.uuid('organization_id').nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Drop columns if they exist using raw SQL to avoid errors
  return knex.raw(`
    ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "middle_name";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "title";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "is_archived";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "is_super_admin";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "organization_id";
  `);
}
