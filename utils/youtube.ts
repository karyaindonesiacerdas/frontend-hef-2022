export const matchYoutubeUrl = (url: string) => {
  const p =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  const matches = url.match(p);
  if (matches) {
    return matches[1];
  }
  return false;
};

export const extractYoutubeParams = (url: string) => {
  const id = matchYoutubeUrl(url);
  const searchParams = new URLSearchParams(url.substring(url.indexOf('?')));
  const list = searchParams.get('list');
  return { id, list };
};
