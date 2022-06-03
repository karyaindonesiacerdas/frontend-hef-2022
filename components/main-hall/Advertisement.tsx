import React from "react";
import { matchYoutubeUrl } from "utils/youtube";

const Advertisement = ({ url }: { url?: string }) => {
  const defaultVideo =
    "https://www.youtube.com/watch?v=jS0qVrpKjY4&ab_channel=HospitalEngineeringExpo";

  const youtubeId = matchYoutubeUrl(url || defaultVideo);

  return (
    <iframe
      style={{ aspectRatio: "16/9" }}
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${youtubeId}?version=3&playlist=${youtubeId}`}
      title="YouTube video player"
      frameBorder="0"
      // allow="autoplay; loop; fullscreen"
    ></iframe>
  );
};

export default Advertisement;
