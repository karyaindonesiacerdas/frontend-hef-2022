import React from "react";
import { extractYoutubeParams } from "utils/youtube";

const Advertisement = ({ url }: { url?: string }) => {
  const defaultVideo =
    "https://www.youtube.com/watch?v=jS0qVrpKjY4&ab_channel=HospitalEngineeringExpo";

    const { id, list } = extractYoutubeParams(url || defaultVideo);
    const params = list
      ? `?listType=playlist&list=${list}&loop=1&index=${Math.floor(Math.random() * 4)}`
      : `${id}?version=3&autoplay=1&playlist=${id}&loop=1`;

  return (
    <iframe
      style={{ aspectRatio: "16/9" }}
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${params}`}
      title="YouTube video player"
      frameBorder="0"
      // allow="autoplay; loop; fullscreen"
    ></iframe>
  );
};

export default Advertisement;
