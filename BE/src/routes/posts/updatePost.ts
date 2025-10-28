import { updatePost as ctrlUpdatePost } from '@/controllers/post';
import ClassValidationError from '@/errors/validationError';
import Post, { PostResponse } from '@/models/post';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import { type UserResponse } from '@models/user';
import { type ControllerParams } from '@ts-types/general-types';
import { validateOrReject, type ValidationError } from 'class-validator';
/**
 * Get all Users
 * @param {ControllerParams} options the query options
 * @returns {Promise<UserResponse>} an array of user objects
 */
const updatePost = async (options: ControllerParams): Promise<PostResponse> => {
  const { body, id } = options;
  if (!body || !id) {
    throw new Error('Invalid user data');
  }
  const data = new Post(body);

  await validateOrReject(data, { skipMissingProperties: true }).catch((errors) => {
    throw new ClassValidationError('An issue Occurred during validation', cleanErrors(errors as ValidationError[]));
  });

  const post = await ctrlUpdatePost(id, data);
  return {
    data: post,
  };
};

export default updatePost;
