import { getPost as getPostController } from "@/controllers/post";
import { PostResponse } from "@/models/post";
import { ControllerParams } from "@/types/general-types";

const getPost = async (options: ControllerParams): Promise<PostResponse> => {
  const { id } = options;
  if (!id) {
    throw new Error('Invalid post data');
  }
  const post = await getPostController(id);
  return post;
};

export default getPost;
