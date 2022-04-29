import { useQuery } from "react-query";

import { getSponsorById } from "../sponsor";

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

export const useSponsor = (id: string) => {
  return useQuery<Sponsor[], Error>(
    ["sponsors", id],
    () => getSponsorById(id),
    {
      staleTime: Infinity,
      enabled: Boolean(id),
      retry: 1,
    }
  );
};
