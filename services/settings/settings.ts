import Cookies from "js-cookie";

export const getSettings = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/setting`;

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

export type UpdateAppSettingsPayload = {
  youtube_link: string;
  zoom_business_link: string;
  zoom_link: string;
  ads1_link: string;
  ads2_link: string;
  webinar_link: string;
  is_chat: 1 | 0; // 1 enabled, 0 disabled
};

export const updateAppSettings = async (payload: UpdateAppSettingsPayload) => {
  const cookies = Cookies.get("accessToken");

  const data = {
    _method: "PUT",
    ...payload,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setting/1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};
