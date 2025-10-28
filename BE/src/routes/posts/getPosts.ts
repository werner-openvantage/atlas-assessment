import { getPosts as ctrlGetPosts } from '@controllers/post';
import { type GetPostsResponse } from '@models/post';
import { type ControllerParams } from '@ts-types/general-types';

/**
 * Get all Users
 * @param {ControllerParams} options the query options
 * @returns {Promise<User[] | undefined>} an array of user objects
 */
const getPosts = async (options: ControllerParams): Promise<GetPostsResponse> => {
  const queryOptions = options.query;
  return await ctrlGetPosts(queryOptions);
};

export default getPosts;
