import { useQuery } from "react-query";

import { getRundowns } from "../rundown";

type Rundown = {
  id: number;
  date: string;
  time: string;
  speakers: string;
  position: string | null;
  title: string;
  subtitle: string | null;
  embedd_link: string | null;
  attachment_link: string | null;
  status: 1 | 2 | 3; // 1: upcomming, 2: now showing, 3: Done
  is_end: 0 | 1;
};

export const useRundowns = () => {
  return useQuery<Rundown[], Error>(["rundowns"], getRundowns, {});
};
