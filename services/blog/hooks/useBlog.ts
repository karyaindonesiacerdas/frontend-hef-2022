import { useQuery } from "react-query";

import { getBlogById } from "../blog";

type Blog = {
  _id: string;
  title: string;
  subtitle: string;
  image: {
    src: string;
    filename: string;
  };
  published: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const useBlog = (id: string) => {
  return useQuery<Blog, Error>(["blogs", id], () => getBlogById(id), {
    staleTime: Infinity,
    enabled: Boolean(id),
    retry: 0,
  });
};
