import { useQuery } from "react-query";

import { getDemographic } from "../user";

type VisitorDemographicDetail = {
  name: string;
  labels: string[];
  series: number[];
}

type VisitorProvinceDemographicDetail = {
  name: string;
  labels: string[];
  series: {
    data: number[];
    name: string;
  }[];
}

type VisitorDemographic = {
  provinces: VisitorProvinceDemographicDetail,
  positions: VisitorDemographicDetail,
  institution_types: VisitorDemographicDetail,
}

export const useVisitorDemographic = (filter: string) => {
  return useQuery<VisitorDemographic, Error>(
    ["visitor-demographic", filter],
    () => getDemographic(filter),
    { staleTime: 1000 * 60 * 5 }
  );
};
