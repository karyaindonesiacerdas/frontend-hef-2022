import { useQuery } from "react-query";

import { getActivityList } from "../activity";

// type Activity = {
//   id: number;
//   name: string;
//   email: string;
//   total_reward: number;
// };

export const useActivityList = () => {
  return useQuery(["activity-list"], getActivityList);
};
