import bcrypt from 'bcryptjs';

export async function seed(knex) {
  const hashedPassword = await bcrypt.hash('K9VzKa4YzEVtw1UsyQ&', 10);

  await knex('users').insert([
    {
      email: 'hazle.lang66@ethereal.email',
      password: hashedPassword,
    },
  ]);
}
