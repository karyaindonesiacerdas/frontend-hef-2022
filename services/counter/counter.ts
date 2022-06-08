export const getPageCounters = async () => {
  const URL = `/api/counter`;

  const res = await fetch(URL);
  const json = await res.json();

  if (!res.ok) {
    throw Error(json.message);
  }

  return json;
};
