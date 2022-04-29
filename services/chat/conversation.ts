export const getConversation = async (id: string) => {
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/conversations/${id}`;

  const res = await fetch(URL, {
    method: "GET",
    // headers: {
    //   Authorization: `Bearer ${accessToken}`,
    // },
  });
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json;
};

export type CreateConversationPayload = {
  sender: {
    id: number;
    name: string;
    email: string;
    img_profile: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
    img_profile: string;
  };
};

export const createConversation = async (
  payload: CreateConversationPayload
) => {
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/conversations`;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json;
};
