import Cookies from "js-cookie";

export type PostActivityPayload = {
  subject_id: number;
  subject_type: string;
  subject_name: string;
  causer_id: number;
};

export const postActivity = async ({
  subject_id,
  subject_name,
  subject_type = "reward",
  causer_id,
}: PostActivityPayload) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/activity`;

  const data = {
    subject_id: subject_id.toString(),
    subject_name,
    subject_type: "reward",
    causer_id: causer_id.toString(),
  };

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json.data;
};
