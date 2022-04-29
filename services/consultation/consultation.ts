import Cookies from "js-cookie";

export const getConsultations = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/consultation`;

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

export type UpdateConsultationPayload = {
  status: number;
};

export const updateConsultation = async (
  consultationId: number,
  payload: UpdateConsultationPayload
) => {
  const cookies = Cookies.get("accessToken");

  const data = {
    _method: "PUT",
    ...payload,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/consultation/${consultationId}`,
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

export const deleteConsultation = async (consultationId: number) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/consultation/${consultationId}`,
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

export type AddConsultationPayload = {
  date: string;
  time: string;
  exhibitor_id: number;
  status: number;
  email: string;
  mobile: string;
  institution_name: string;
};

export const addConsultation = async (payload: AddConsultationPayload) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/consultation/guest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const getBookedConsultation = async (exhibitor_id: number) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/consultation/available?exhibitor_id=${exhibitor_id}`,
    {
      method: "GET",
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

  return json.data;
};
