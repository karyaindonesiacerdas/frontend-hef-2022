import { createStyles } from "@mantine/core";
import React from "react";
import { matchYoutubeUrl } from "utils/youtube";

const useStyles = createStyles((theme) => ({
  leftAdvertisementContainer: {
    position: "absolute",
    top: "31.75%",
    left: "32.25%",
    perspective: "600px",
    width: "14.75%",
    height: "20%",
  },
  leftAdvertisement: {
    transform: "rotateY(10deg) rotateX(0deg) rotateZ(1deg)",
    width: "100%",
    height: "100%",
  },
}));

const LeftAdvertisement = ({ url }: { url?: string }) => {
  const { classes } = useStyles();

  const defaultVideo =
    "https://www.youtube.com/watch?v=jS0qVrpKjY4&ab_channel=HospitalEngineeringExpo";

  const youtubeId = matchYoutubeUrl(url || defaultVideo);

  return (
    <div className={classes.leftAdvertisementContainer}>
      <div className={classes.leftAdvertisement}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?version=3&autoplay=1&playlist=${youtubeId}&mute=1&loop=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; loop; fullscreen"
        ></iframe>
      </div>
    </div>
  );
};

export default LeftAdvertisement;
