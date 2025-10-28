import bcrypt from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed (knex) {
  await knex('users').del();
  await knex('posts').del();

  const hashedPassword = await bcrypt.hash('Admin1234@', 10);
  const user = await knex('users').insert([
    {
      email: 'admin@atlas.co.za',
      password: hashedPassword,
    },
  ]).returning('id');


  const post = await knex('posts').insert([
    {
      title: 'Post 1',
      content: 'Content 1',
      user_id: user[0].id,
    },
  ]);
  return { user, post };
};
