import { useQuery } from "react-query";

import { getDemographic } from "../user";

type VisitorDemographicDetail = {
  name: string;
  labels: string[];
  series: number[];
}

type VisitorDemographic = {
  provinces: VisitorDemographicDetail,
  positions: VisitorDemographicDetail,
  institution_types: VisitorDemographicDetail,
}

export const useVisitorDemographic = () => {
  return useQuery<VisitorDemographic, Error>(
    ["visitor-demographic"],
    getDemographic,
    { staleTime: 1000 * 60 * 5 }
  );
};
