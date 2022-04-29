import { useQuery } from "react-query";

import { getBookedConsultation } from "../consultation";

type Booked = {
  id: number;
  date: string;
  time: string;
};

export const useBookedConsultations = (employee_id: number) => {
  return useQuery<Booked[], Error>(
    ["booked-consultations", employee_id],
    () => getBookedConsultation(employee_id),
    {
      enabled: Boolean(employee_id),
    }
  );
};
