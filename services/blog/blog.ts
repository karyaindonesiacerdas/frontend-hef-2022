import Cookies from "js-cookie";

export const getBlogs = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/blogs`;

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

export const getBlogById = async (id: string) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_CHAT_API}/blogs/${id}`;

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

export type AddBlogPayload = {
  title: string;
  subtitle: string;
  published: boolean;
  image: {
    src: string;
    filename: string;
  };
  content: string;
};

export const addBlog = async (payload: AddBlogPayload) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/blogs`, {
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

export type UpdateBlogPayload = {
  title?: string;
  subtitle?: string;
  published?: boolean;
  image?: {
    src: string;
    filename: string;
  };
  content?: string;
};

export const updateBlog = async (
  blogId: string,
  payload: UpdateBlogPayload
) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_API}/blogs/${blogId}`,
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

export const deleteBlog = async (blogId: string) => {
  const cookies = Cookies.get("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_API}/blogs/${blogId}`,
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
