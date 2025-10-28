import { createPost as ctrlCreatePost } from '@controllers/post';
import ClassValidationError from '@/errors/validationError';
import Post, { type PostResponse } from '@models/post';
import { type ControllerParams } from '@ts-types/general-types';
import { cleanErrors } from '@/utils/helpers/cleanErrors';
import { validateOrReject, type ValidationError } from 'class-validator';
/**
 * Get all Users
 * @param {ControllerParams} options the query options
 * @returns {Promise<UserResponse>} an array of user objects
 */
const createPostRoute = async (options: ControllerParams): Promise<PostResponse> => {
  const { body } = options;
  if (!body) {
    throw new Error('Invalid post data');
  }
  const data = new Post(body);
  await validateOrReject(data).catch((errors) => {
    console.log('errors: ', errors);
    throw new ClassValidationError('An issue occurred during validation', cleanErrors(errors as ValidationError[]));
  });

  const post = await ctrlCreatePost(data);

  if (!post?.id) {
    throw new Error('Something went wrong creating post');
  }

  return {
    data: post,
  };
};

export default createPostRoute;
