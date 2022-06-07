import { useQuery } from "react-query";

import { getPositions } from "../position";

type Position = {
  id: number;
  name: string;
};

export const usePositions = () => {
  return useQuery<Position[], Error>(["positions"], () => getPositions(), {
    staleTime: Infinity,
  });
};
