import { useQuery } from "react-query";

import { getUserRewardsList, GetUserRewardsListParams } from "../user-reward";

export type UserReward = {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  rewards: number;
}

export type UserRewardsList = {
  current_page: number;
  last_page: number;
  from: number;
  total: number;
  data: UserReward[];
};

export const useUserRewardsList = (params: GetUserRewardsListParams) => {
  return useQuery<UserRewardsList, Error>(
    ["attendees-list", params],
    () => getUserRewardsList(params),
    {
      staleTime: 1000 * 60 * 1,
    }
  );
};
