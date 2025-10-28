import { GetPostsResponse, Post, PostResponse } from '@/models/post';
import QueryOptions from '@/types/query-options';
import { buildFilter, buildPagination, buildWhere, createValidFilter } from '@/utils/helpers/db';
import db from '@utils/knex';

const Knex = db();

const defaultSelect = ['posts.*'];

export const getPosts = async (options?: QueryOptions, cols: string[] = defaultSelect): Promise<GetPostsResponse> => {
  const searchFields = ['atlas.posts.title', 'atlas.posts.content'];
  if(options) {
    const { filter } = options;
    const filterForPost = new Post(createValidFilter(filter) as Partial<Post> as Post, {
      filter: true,
      update: false,
    });
    options.filter = buildFilter<Post>(filter, filterForPost);

    if(options.sort) {
      if (
        options.sort.includes('created_at') ||
        options.sort.includes('updated_at') ||
        options.sort.includes('id')
      ) {
        options.sort = `atlas.posts.${options.sort}`;
      }
    }

    if(options.search) {
      options.search = `atlas.posts.${options.search}`;
    }
  }

  const posts = (await Knex('posts')
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
    })) as Post[];

  const count = await Knex('posts')
    .where((builder) => {
      if (options) {
        buildWhere(options, searchFields, builder);
      }
    })
    .count('posts.id as count');

  return {
    data: posts as Post[],
    count: Number(count[0].count ?? 0),
  };
};

export const getPost = async (id: string, cols: string[] = defaultSelect): Promise<PostResponse> => {
  const post = await Knex('posts')
    .select(cols)
    .where('posts.id', id).first();
  return {
    data: post as Post,
  };
};

export const createPost = async (data: Post): Promise<Post> => {
  const post = await Knex('posts').insert(data).returning('*');
  return post as Post;
};

export const updatePost = async (id: string, data: Post): Promise<Post> => {
  const post = await Knex('posts').where('posts.id', id).update(data).returning('*');
  return post as Post;
};

export const deletePost = async (id: string): Promise<Post> => {
  const post = await Knex('posts').where('posts.id', id).delete().returning('*');
  return post as Post;
};
