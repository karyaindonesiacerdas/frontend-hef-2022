import Cookies from "js-cookie";

export const getRundowns = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/rundown`;

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

export type AddRundownPayload = {
  title: string;
  subtitle: string;
  speakers: string;
  position: string;
  date: string;
  time: string;
};

export const addRundown = async (payload: AddRundownPayload) => {
  const cookies = Cookies.get("accessToken");

  const data = {
    embedd_link: "-",
    status: 1,
    ...payload,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rundown`, {
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

export type UpdateRundownPayload = {
  title: string;
  subtitle: string;
  speakers: string;
  position: string;
  date: string;
  time: string;
  status: number;
  embedd_link: string;
  attachment_link: string;
};

export const updateRundown = async (
  rundownId: number,
  payload: UpdateRundownPayload
) => {
  const cookies = Cookies.get("accessToken");

  const data = {
    _method: "PUT",
    ...payload,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rundown/${rundownId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};

export const deleteRundown = async (rundownId: number) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rundown/${rundownId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies}`,
      },
    }
  );

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};
