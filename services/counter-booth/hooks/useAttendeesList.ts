import { useQuery } from "react-query";

import { getAttendeesList, GetAttendeesListParams } from "../counter-webinar";
import { Visitor } from "./useVisitorViews"

export type AttendeesList = {
  current_page: number;
  last_page: number;
  from: number;
  total: number;
  data: Visitor[];
};

export const useAttendeesList = (params: GetAttendeesListParams) => {
  return useQuery<AttendeesList, Error>(
    ["attendees-list", params],
    () => getAttendeesList(params),
    {
      staleTime: 1000 * 60 * 1,
    }
  );
};
