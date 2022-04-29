export type GetMessageProps = {
  conversationId: string;
  page?: number;
  limit?: number;
};

export const getMessages = async ({
  conversationId,
  page = 1,
  limit = 50,
}: GetMessageProps) => {
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/messages/${conversationId}?page=${page}&limit=${limit}`;

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

export type AddMessagePayload = {
  conversationId: string;
  sender: number;
  text: string;
};

export const addMessage = async (payload: AddMessagePayload) => {
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/messages`;

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

export type ReadMessagesPayload = {
  conversationId: string;
  sender: number;
};

export const readMessages = async ({
  conversationId,
  sender,
}: ReadMessagesPayload) => {
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/messages/read/${conversationId}`;

  const res = await fetch(URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender,
    }),
  });
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json;
};
