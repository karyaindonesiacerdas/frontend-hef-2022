import Cookies from "js-cookie";

export const getSponsors = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/sponsors`;

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

  return json;
};

export const getSponsorById = async (id: string) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/sponsors/${id}`;

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

  return json;
};

export type AddSponsorPayload = {
  name: string;
  logo: {
    src: string;
    filename: string;
  };
  level: string;
};

export const addSponsor = async (payload: AddSponsorPayload) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/sponsors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};

export type UpdateSponsorPayload = {
  name?: string;
  logo?: {
    src: string;
    filename: string;
  };
  level?: string;
};

export const updateSponsor = async (
  sponsorId: string,
  payload: UpdateSponsorPayload
) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_API}/sponsors/${sponsorId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw await res.json();
  }

  const json = await res.json();

  return json;
};

export const deleteSponsor = async (sponsorId: string) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_API}/sponsors/${sponsorId}`,
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

  return {};
};
