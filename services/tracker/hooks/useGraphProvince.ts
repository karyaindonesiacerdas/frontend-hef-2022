import { useQuery } from "react-query";

import { getGraphProvince } from "../tracker";

export const useGraphProvince = () => {
  return useQuery(["graph-province"], getGraphProvince);
};
