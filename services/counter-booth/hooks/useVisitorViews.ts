import { useQuery } from "react-query";

import { getRandomVisitor, GetRandomVisitorParams, getVisitorViews, GetVisitorViewsParams } from "../counter-booth";

export type Visitor = {
  id: number;
  name: string;
  institution_name?: string;
  email?: string;
  mobile?: string;
  province?: string;
  referral?: string;
  allow_share_info?: 0 | 1;
}

type VisitorViews = {
  current_page: number;
  last_page: number;
  from: number;
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
    visitor: Visitor;
  }[];
};

type RandomVisitor = {
  total: number;
  winner: Visitor;
  list: string[];
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

export const useRandomVisitor = (params: GetRandomVisitorParams) => {
  return useQuery<RandomVisitor, Error>(
    ["random-visitor", params],
    () => getRandomVisitor(params),
    {
      staleTime: 1000 * 5,
    }
  );
};
