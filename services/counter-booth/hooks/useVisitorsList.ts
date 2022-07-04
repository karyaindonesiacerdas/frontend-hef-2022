import { useQuery } from "react-query";

import { getVisitorsList, GetVisitorsListParams } from "../counter";
import { Visitor } from "./useVisitorViews"

export type VisitorsList = {
  current_page: number;
  last_page: number;
  from: number;
  total: number;
  data: Visitor[];
};

export const useVisitorsList = (params: GetVisitorsListParams) => {
  return useQuery<VisitorsList, Error>(
    ["visitors-list", params],
    () => getVisitorsList(params),
    {
      staleTime: 1000 * 60 * 1,
    }
  );
};
