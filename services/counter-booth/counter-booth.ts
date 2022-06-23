import Cookies from "js-cookie";

export const getBoothVisitors = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/admin/list-visitor-views`;

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

export type GetVisitorViewsParams = {
  exhibitorId?: string;
  page?: number;
  limit?: number;
  filter?: string;
  sortColumn?: string;
  sortDirection?: string;
};

export const getVisitorViews = async ({
  exhibitorId = '',
  page = 1,
  limit = 100,
  filter = "",
  sortColumn = "",
  sortDirection = "",
}: GetVisitorViewsParams) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/list-visitor-views?exhibitor_id=${exhibitorId}&page=${page}&limit=${limit}&filter=${filter}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;

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
