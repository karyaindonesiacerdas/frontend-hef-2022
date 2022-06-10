import { useQuery } from "react-query";

import { getExhibitor } from "../exhibitor";

type Package = {
  id: number;
  name: string;
  order: number;
};

export type Banner = {
  id: number;
  exhibitor_id: number;
  display_name: string;
  description: string;
  image: string;
  order: number;
  type: string | null;
  created_at: string;
  updated_at: string;
};

export type Exhibitor = {
  id: number;
  business_nature: string[];
  ala_carte: string[];
  company_logo: string;
  company_name: string;
  company_order: string;
  company_website: string;
  company_video_url: string;
  name: string;
  email: string;
  package_id: number;
  package: Package;
  published: 0 | 1;
  mobile: string;
  banners: Banner[];
  exhibitor_type: string | null;
};

export const useExhibitor = (id: string) => {
  return useQuery<Exhibitor, Error>(
    ["exhibitors", id],
    () => getExhibitor(id),
    {
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 1,
    }
  );
};
