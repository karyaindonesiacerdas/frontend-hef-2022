import Cookies from "js-cookie";

export const getWebinarAttendees = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/admin/list-webinar-attendees`;

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

export type GetAttendeesListParams = {
  webinarId?: string;
  page?: number;
  limit?: number;
  filter?: string;
  sortColumn?: string;
  sortDirection?: string;
};

export const getAttendeesList = async ({
  webinarId = '',
  page = 1,
  limit = 100,
  filter = "",
  sortColumn = "",
  sortDirection = "",
}: GetAttendeesListParams) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/list-webinar-attendees?package_id=${webinarId}&page=${page}&limit=${limit}&filter=${filter}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;

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
