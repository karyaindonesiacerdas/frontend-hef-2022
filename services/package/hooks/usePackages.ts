import { useQuery } from "react-query";

import { getPackages } from "../package";

type Package = {
  id: number;
  name: string;
  order: number;
};

export const usePackages = () => {
  return useQuery<Package[], Error>(["packages"], () => getPackages(), {
    staleTime: Infinity,
  });
};
