
import { deletePost as ctrlDeletePost } from '@controllers/post';
import { type PostResponse } from '@models/post';
import { type ControllerParams } from '@ts-types/general-types';
/**
 * Get all Users
 * @param {ControllerParams} options the query options
 * @returns {Promise<UserResponse>} an array of user objects
 */
const deletePost = async (options: ControllerParams): Promise<PostResponse> => {
  const { id } = options;
  if (!id) {
    throw new Error('Invalid user data');
  }
  const post = await ctrlDeletePost(id);
  return {
    data: post,
  };
};

export default deletePost;
