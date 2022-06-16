import { createStyles } from "@mantine/core";
import React from "react";
import { extractYoutubeParams } from "utils/youtube";

const useStyles = createStyles((theme) => ({
  rightAdvertisementContainer: {
    position: "absolute",
    top: "31.75%",
    right: "32.25%",
    perspective: "600px",
    width: "14.75%",
    height: "20%",
  },
  rightAdvertisement: {
    transform: "rotateY(-10deg) rotateX(0deg) rotateZ(-1deg)",
    width: "100%",
    height: "100%",
  },
}));

const RightAdvertisement = ({ url }: { url?: string }) => {
  const { classes } = useStyles();

  const defaultVideo =
    "https://www.youtube.com/watch?v=jS0qVrpKjY4&ab_channel=HospitalEngineeringExpo";

    const { id, list } = extractYoutubeParams(url || defaultVideo);
    const params = list
      ? `?listType=playlist&autoplay=1&list=${list}&mute=1&loop=1&index=${Math.floor(Math.random() * 4)}`
      : `${id}?version=3&autoplay=1&playlist=${id}&mute=1&loop=1`;

  return (
    <div className={classes.rightAdvertisementContainer}>
      <div className={classes.rightAdvertisement}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${params}`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; loop; fullscreen"
        ></iframe>
      </div>
    </div>
  );
};

export default RightAdvertisement;
