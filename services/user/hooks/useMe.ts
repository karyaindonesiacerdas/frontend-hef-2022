import { useQuery } from "react-query";

import { getMe } from "../user";

export const useMe = () => {
  return useQuery(["me"], getMe);
};
