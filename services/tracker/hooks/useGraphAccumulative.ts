import { useQuery } from "react-query";

import { getGraphAccumulative } from "../tracker";

export const useGraphAccumulative = () => {
  return useQuery(["graph-accumulative"], getGraphAccumulative);
};
