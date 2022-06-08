import { useQuery } from "react-query";

import { getPageCounters } from "./counter";

type Counter = {
  id: number;
  route: string;
  totalVisit: number;
};

export const usePageCounters = () => {
  return useQuery<Counter[], Error>(["page-counters"], getPageCounters, {
    staleTime: 60 * 1000,
  });
};
