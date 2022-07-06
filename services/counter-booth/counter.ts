import Cookies from "js-cookie";

export type GetVisitorsListParams = {
  page?: number;
  limit?: number;
  filter?: string;
  webinarId?: string;
  sortColumn?: string;
  sortDirection?: string;
};

export const getVisitorsList = async ({
  page = 1,
  limit = 100,
  filter = "",
  webinarId = "all",
  sortColumn = "",
  sortDirection = "",
}: GetVisitorsListParams) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/user/list-visitor?page=${page}&limit=${limit}&filter=${filter}&package_id=${webinarId}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;

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
