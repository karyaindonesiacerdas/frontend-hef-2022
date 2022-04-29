import { useQuery } from "react-query";

import { getSponsors } from "../sponsor";

type Sponsor = {
  _id: string;
  name: string;
  logo: {
    src: string;
    filename: string;
  };
  level: string;
  cretedAt: string;
  updatedAt: string;
};

export const useSponsors = () => {
  return useQuery<Sponsor[], Error>(["sponsors"], getSponsors, {
    staleTime: Infinity,
    retry: 1,
  });
};
