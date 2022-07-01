import Cookies from "js-cookie";

export type GetUserRewardsListParams = {
  page?: number;
  limit?: number;
  filter?: string;
  sortColumn?: string;
  sortDirection?: string;
};

export const getUserRewardsList = async ({
  page = 1,
  limit = 100,
  filter = "",
  sortColumn = "",
  sortDirection = "",
}: GetUserRewardsListParams) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/user-rewards?page=${page}&limit=${limit}&filter=${filter}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json.data;
};
