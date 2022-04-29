import { useQuery } from "react-query";

import { getGraphTotal } from "../tracker";

export const useGraphTotal = () => {
  return useQuery(["graph-total"], getGraphTotal);
};
