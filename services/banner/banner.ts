import Cookies from "js-cookie";

export const getBanners = async () => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/exhibitor/banner`;

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

export type UploadBannerPayload = {
  display_name?: string;
  description?: string;
  image?: File;
  order: number; // 1 - 5 poster, 11 Name Card, 12 Catalog
};

export const uploadBanner = async ({
  description,
  display_name,
  image,
  order,
}: UploadBannerPayload) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/exhibitor/banner`;

  const formData = new FormData();
  display_name && formData.append("display_name", display_name);
  description && formData.append("description", description);
  formData.append("order", String(order));
  image && formData.append("image", image);

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json.data;
};

export const deleteBanner = async (id: number) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/exhibitor/banner/${id}`;

  const res = await fetch(URL, {
    method: "DELETE",
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
