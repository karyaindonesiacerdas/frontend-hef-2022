import Cookies from "js-cookie";

export type GetExhibitorsParams = {
  showAll?: boolean;
};

export const getExhibitors = async ({
  showAll = true,
}: GetExhibitorsParams) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/exhibitor?show_package=${
    showAll ? 0 : 1
  }`;

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

export const getExhibitor = async (id: string) => {
  const accessToken = Cookies.get("accessToken");
  const URL = `${process.env.NEXT_PUBLIC_API_URL}/exhibitor/${id}`;

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

export const allowToHaveCatalog = (id: number | null | undefined) => id && ![5267, 5270, 5565].includes(id);
export const allowToHaveNameCard = (id: number | null | undefined) => id && ![5270, 5565].includes(id);
export const allowToHaveCatalogAndNameCard = (id: number | null | undefined) => id && ![5270, 5565].includes(id);
export const allowToHaveLiveChat = (id: number | null | undefined) => id && [5196, 5241, 5267, 5280, 5283, 5417, 5563].includes(id);
export const getMobileLink = (id: number | null | undefined, mobile: string | null | undefined) => {
  if (allowToHaveLiveChat(id)) {
    return `https://wa.me/${mobile?.replace(/^0/, '62')}?text=Saya tertarik dengan produk Anda`;
  }
  return `tel:${mobile}`;
}
