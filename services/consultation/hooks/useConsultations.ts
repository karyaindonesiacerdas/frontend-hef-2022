import { useQuery } from "react-query";

import { getConsultations } from "../consultation";

type Consultation = {
  id: number;
  date: string;
  time: string;
  status: number;
  visitor: {
    id: number;
    name: string;
    institution_name: string;
    mobile: string;
    referral: string;
  };
  exhibitor: {
    id: number;
    company_name: string;
  };
};

export const useConsultations = () => {
  return useQuery<Consultation[], Error>(["consultations"], getConsultations, {
    staleTime: 1000 * 60 * 1,
  });
};
