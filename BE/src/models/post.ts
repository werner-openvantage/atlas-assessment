import { ResponseModel } from "@/types/response-model";
import notNull from "@/utils/helpers/notNull";
import { IsDate, Length } from "class-validator";
import dayjs from "dayjs";

export interface PostResponse extends ResponseModel {
  data: Post;
}

export interface GetPostsResponse extends ResponseModel {
  data: Post[];
}

export class Post {
  // PK VARCHAR(250) NN id
  @Length(1, 250)
  id?: string;

  @Length(1, 250)
  title?: string;

  @Length(1, 250)
  content?: string;

  @Length(1, 250)
  user_id?: string;

  @IsDate()
  created_at?: Date;

  @IsDate()
  updated_at?: Date;

  constructor(data: any, { filter = false, update = false } = {}) {
    if (notNull(data.title)) {
      this.title = data.title;
    }
    if (notNull(data.content)) {
      this.content = data.content;
    }
    if (notNull(data.title)) {
      this.title = data.title;
    }

    if (update) {
      this.updated_at = dayjs().toDate();
    }
    if (filter) {
      if (notNull(data.created_at)) {
        if (Array.isArray(data.created_at)) {
          this.created_at = dayjs(data.created_at[0]).toDate();
        } else {
          this.created_at = dayjs(data.created_at).toDate();
        }
      }
      if (notNull(data.updated_at)) {
        if (Array.isArray(data.updated_at)) {
          this.updated_at = dayjs(data.updated_at[0]).toDate();
        } else {
          this.updated_at = dayjs(data.updated_at).toDate();
        }
      }
    }
  }
}

export default Post;
