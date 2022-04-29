import { useInfiniteQuery, useQuery } from "react-query";

import { getMessages } from "../messages";

type Message = {
  _id: string;
  conversationId: string;
  sender: number;
  text: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useMessages = (conversationId: string) => {
  return useQuery<Message[], Error>(
    ["messages", conversationId],
    () => getMessages({ conversationId }),
    { enabled: Boolean(conversationId), staleTime: Infinity }
  );
};

const LIMIT_CHAT = 40;

export const useInfiniteMessages = (conversationId: string) => {
  return useInfiniteQuery<Message[], Error>(
    ["messages", conversationId],
    ({ pageParam = 1 }) =>
      getMessages({
        conversationId,
        page: pageParam,
        limit: LIMIT_CHAT,
      }),
    {
      enabled: Boolean(conversationId),
      getNextPageParam: (lastPage, pages) => {
        console.log({ lastPage });
        if (lastPage.length >= LIMIT_CHAT) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    }
  );
};
