import Cookies from "js-cookie";

export const checkUserByEmail = async (email: string) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/user/detail?email=${email}`;

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

export const getMe = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;

  const res = await fetch(URL, {
    method: "POST",
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

export const getDemographic = async (filter: string) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/user/demographic?filter=${filter}`;

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
