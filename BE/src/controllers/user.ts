import { type UserResponse, type GetUsersResponse, User, type UserArchivedStatusResponseModel } from '@models/user';
import type QueryOptions from '@ts-types/query-options';
import { buildFilter, buildPagination, buildWhere, createValidFilter } from '@utils/helpers/db';
import db from '@utils/knex';

const Knex = db();

const defaultSelect = ['users.*'];

// #region User Queries
/**
 * Get all Users
 * @param { QueryOptions } options the query options
 * @param { string | string[] } cols the columns to select
 * @returns {Promise<User[]>} an array of user objects
 * @example
 * const users = userController.getUsers();
 */
export const getUsers = async (
  options?: QueryOptions,
  cols: string[] = defaultSelect,
): Promise<GetUsersResponse> => {
  const searchFields = ['atlas.users.email', 'first_name', 'last_name', 'atlas.users.contact_number', 'company.name'];
  if (options) {
    const { filter } = options;
    const filterForUserRole = new User(createValidFilter(filter) as Partial<User> as User, {
      filter: true,
      update: false,
    });
    options.filter = buildFilter<User>(filter, filterForUserRole);
    options.filter = options.filter.map((f) => {
      if (
        f.name === 'created_at' ||
        f.name === 'updated_at' ||
        f.name === 'is_archived' ||
        f.name === 'status' ||
        f.name === 'id'
      ) {
        f.name = `atlas.user.${f.name}`;
      }
      return f;
    });

    if(options.sort) {
      if (
        options.sort.includes('created_at') ||
        options.sort.includes('updated_at') ||
        options.sort.includes('is_archived') ||
        options.sort.includes('status') ||
        options.sort.includes('id')
      ) {
        options.sort = `atlas.user.${options.sort}`;
      }
    }
  }
  const users = (await Knex('users')
    .select(cols)
    .where((builder) => {
      if (options) {
        buildWhere(options, searchFields, builder);
      }
    })
    .modify((builder) => {
      if (options) {
        buildPagination(options, builder);
      }
    })) as User[];

  const count = await Knex('users')
    .where((builder) => {
      if (options) {
        buildWhere(options, searchFields, builder);
      }
    })
    .count('users.id as count');
  return {
    data: users,
    count: Number(count[0].count ?? 0),
  };
};

/**
 * Get a User
 * @param {string} id the user id to get
 * @param {string | string[]} cols the columns to select
 *
 * @returns {Promise<User>} the user object
 */
export const getUser = async (id: string, cols: string[] = defaultSelect): Promise<UserResponse> => {
  const user = (await Knex('users')
    .select(cols)
    .where('users.id', id)
    .first()) as User;
  return {
    data: user,
  };
};

/**
 * Check if a user with the email exists
 * @param {string} email the user id to get
 * @returns {Promise<boolean>} the user object
 */
export const emailExists = async (email: string): Promise<boolean> => {
  return (await Knex('users').select('email').where('email', email)).length > 0;
};

/**
 * Check if a user with the email exists and is is_archived
 * @param {string} email the user email to get
 * @returns {Promise<UserArchivedStatusResponseModel>} the user object
 */
export const emailIsIs_archived = async (email: string): Promise<UserArchivedStatusResponseModel> => {
  const user = (await Knex('users').select('is_archived', 'id').where({ email }).first()) as User;
  if (!user) {
    return { is_archived: undefined, id: undefined };
  }
  return { is_archived: user.is_archived, id: user.id };
};
// #endregion User Queries

// #region User Mutations
/**
 * Reinstate a User
 * @param {string} id the user id to reinstate
 * @param {string | string[]} cols the columns to select
 * @returns {Promise<string>}
 */
export const reinstateUser = async (id: string, cols: string | string[] = 'id'): Promise<User> => {
  const user = await Knex('users').update({ is_archived: false }).where('id', id).returning(cols);
  return user[0] as User;
};

/**
 * Create a User
 * @param {User} data the user data object to create
 * @returns {Promise<User>} the created user object
 * @example
 * const user = userController.createUser(userData);
 */
export const createUser = async (data: User): Promise<User> => {
  const createUserData = await Knex('users').insert(data).returning('id');
  const user = createUserData[0] as User;
  if (!user) {
    throw new Error('User not created');
  }
  return user;
};

/**
 * Update a User
 * @param {User} data the user data object to update
 * @param {string} id the user id to update
 * @param {string | string[]} cols the columns to select
 * @returns {Promise<string>}
 */
export const updateUser = async (data: Partial<User>, id: string, cols: string | string[] = 'id'): Promise<User> => {
  const user = await Knex('users').update(data).where('id', id).returning(cols);
  return user[0] as User;
};

/**
 * Update a User
 * @param {string} password the new password for the user
 * @param {string} id the user id to update
 * @returns {Promise<boolean>}
 */
export const updatePassword = async (password: string, id: string): Promise<boolean> => {
  return await Knex('users').update('password', password).where('id', id).returning('id');
};

/**
 * Delete a User
 * @param {string} id the user id to delete
 * @returns {Promise<string>}
 */
export const deleteUser = async (id: string): Promise<User> => {
  return await Knex('users').delete().where('id', id).returning('id');
};
// #endregion User Mutations

export default {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
