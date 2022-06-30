import { useQuery } from "react-query";

import { getSettings } from "../settings";
import type { ImageItemType } from "../settings";

export type Settings = {
  id: number;
  youtube_link: string;
  zoom_link: string;
  zoom_business_link: string;
  webinar_link: string;
  ads1_link: string;
  ads2_link: string;
  is_chat: string;
  doorprize?: {
    randomizer_time: number,
    sponsors: ImageItemType[],
    rewards: ImageItemType[],
  };
};

export const useSettings = () => {
  return useQuery<Settings, Error>(["settings"], getSettings);
};
