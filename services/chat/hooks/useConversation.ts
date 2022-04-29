import { useQuery } from "react-query";

import { getConversation } from "../conversation";

export type Conversation = {
  _id: string;
  members: {
    id: number;
    name: string;
    email: string;
    img_profile: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export const useConversation = (id: string) => {
  return useQuery<Conversation[], Error>(
    ["conversation", id],
    () => getConversation(id),
    { enabled: Boolean(id), staleTime: Infinity }
  );
};
