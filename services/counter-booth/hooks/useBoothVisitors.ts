import { useQuery } from "react-query";

import { getBoothVisitors } from "../counter-booth";

type BoothVisitors = {
  id: string;
  company_name: string;
  total_visitors: number;
};

export const useBoothVisitors = () => {
  return useQuery<BoothVisitors[], Error>(
    ["booth-visitors"],
    getBoothVisitors,
    {
      staleTime: 1000 * 60 * 1,
    }
  );
};
