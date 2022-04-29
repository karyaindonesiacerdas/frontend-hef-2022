import { useQuery } from "react-query";

import { getVisitorViews, GetVisitorViewsParams } from "../counter-booth";

type VisitorViews = {
  current_page: number;
  last_page: number;
  total: number;
  data: {
    id: number;
    visitor_id: number;
    exhibitor_id: number;
    created_at: string;
    updated_at: string;
    exhibitor: {
      id: number;
      company_name: string;
    };
    visitor: {
      id: number;
      name: string;
      institution_name: string;
      email: string;
      mobile: string;
      province: string;
      referral: string;
      allow_share_info: 0 | 1;
    };
  }[];
};

export const useVisitorViews = (params: GetVisitorViewsParams) => {
  return useQuery<VisitorViews, Error>(
    ["visitor-views", params],
    () => getVisitorViews(params),
    {
      staleTime: 1000 * 60 * 1,
    }
  );
};
