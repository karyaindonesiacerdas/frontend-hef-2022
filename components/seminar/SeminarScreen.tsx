import { createStyles } from "@mantine/core";
import React from "react";
import { useSettings } from "services/settings/hooks";
import { matchYoutubeUrl } from "utils/youtube";

const useStyles = createStyles((theme) => ({
  seminarContainer: {
    position: "absolute",
    // top: "48.5%",
    top: "42.7%",
    left: "28.9%",
    perspective: "600px",
    width: "40.3%",
    // height: "34%",
    height: "41%",
  },
  seminar: {
    width: "100%",
    height: "100%",
  },
}));

const SeminarScreen = () => {
  const { classes } = useStyles();
  const { data } = useSettings();

  const defaultVideo =
    "https://www.youtube.com/watch?v=jS0qVrpKjY4&ab_channel=HospitalEngineeringExpo";

  const youtubeId = matchYoutubeUrl(data?.youtube_link || defaultVideo);

  return (
    <div className={classes.seminarContainer}>
      <div className={classes.seminar}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&loop=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; loop; fullscreen"
        ></iframe>
      </div>
    </div>
  );
};

export default SeminarScreen;
