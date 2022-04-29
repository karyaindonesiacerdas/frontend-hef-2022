import { useQuery } from "react-query";

import { getBlogs } from "../blog";

type Blog = {
  _id: string;
  title: string;
  subtitle: string;
  image: {
    src: string;
    filename: string;
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useBlogs = () => {
  return useQuery<Blog[], Error>(["blogs"], getBlogs, {
    staleTime: Infinity,
    retry: 1,
  });
};
