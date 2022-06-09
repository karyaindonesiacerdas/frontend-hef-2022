import { useQuery } from "react-query";

import { getTotalVisitorByRegistrationMethod } from "./admin";

type Data = {
  total_full_registration: number;
  total_phone_registration: number;
};

export const useTotalVisitorByRegistrationMethod = () => {
  return useQuery<Data, Error>(
    ["total-visitor-by-registration"],
    getTotalVisitorByRegistrationMethod,
    {
      staleTime: 1000 * 60,
    }
  );
};
