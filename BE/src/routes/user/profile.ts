import { getUser } from "@/controllers/user";
import { UserResponse } from "@/models/user";
import { ControllerParams } from "@/types/general-types";

const getProfile = async (options: ControllerParams): Promise<UserResponse> => {
  const { user } = options;
  if (!user?.id) {
    throw new Error('Invalid user data');
  }
  return await getUser(user.id);
};

export default getProfile;
