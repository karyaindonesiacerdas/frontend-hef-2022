import React from "react";
import { useSettings } from "services/settings/hooks";
import { matchYoutubeUrl } from "utils/youtube";

const MobileSeminarScreen = () => {
  const { data } = useSettings();

  const defaultVideo =
    "https://www.youtube.com/watch?v=jS0qVrpKjY4&ab_channel=HospitalEngineeringExpo";

  const youtubeId = matchYoutubeUrl(data?.youtube_link || defaultVideo);

  return (
    <iframe
      style={{ aspectRatio: "16/9" }}
      width="100%"
      height="100%"
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&loop=1`}
      title="YouTube video player"
      frameBorder="0"
      allow="autoplay; loop; fullscreen"
    ></iframe>
  );
};

export default MobileSeminarScreen;
