import Cookies from "js-cookie";

export const getTotalVisitorByRegistrationMethod = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/admin/total-visitor-registration`;

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
