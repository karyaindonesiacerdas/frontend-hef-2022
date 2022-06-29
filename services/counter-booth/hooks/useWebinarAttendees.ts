import { useQuery } from "react-query";

import { getWebinarAttendees } from "../counter-webinar";

type WebinarAttendees = {
  id: string;
  name: string;
  order: number;
  total_attendees: {
    registered: number;
    surveyed: number;
  }
};

export const useWebinarAttendees = () => {
  return useQuery<WebinarAttendees[], Error>(
    ["webinar-attendees"],
    getWebinarAttendees,
    {
      staleTime: 1000 * 60 * 5,
    }
  );
};
