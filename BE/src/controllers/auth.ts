import type User from '@models/user';
import db from '@utils/knex';

const Knex = db();

/**
 * Login User
 * @param {string} email the email of the user
 * @returns {Promise<User | undefined>} the user object
 */
export const loginUser = async (email: string): Promise<User | undefined> => {
  const user = (await Knex('users')
    .select(
      'id',
      'email',
      'password',
    )
    .where('email', 'ILIKE', email)
    .first()) as User;
  return user;
};
