import { useQuery } from "react-query";

import { getExhibitors, GetExhibitorsParams } from "../exhibitor";

type Package = {
  id: number;
  name: string;
  order: number;
};

type Exhibitor = {
  id: number;
  business_nature: string[];
  ala_carte: string[];
  company_logo: string;
  company_name: string;
  company_order: string;
  name: string;
  package_id: number;
  package: Package;
  published: 0 | 1;
  position: number;
};

export const useExhibitors = (params: GetExhibitorsParams) => {
  return useQuery<Exhibitor[], Error>(
    ["exhibitors", params],
    () => getExhibitors(params),
    {
      staleTime: 1000 * 30,
    }
  );
};
