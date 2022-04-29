import React, { useEffect, useState } from "react";
import { createStyles, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { Volume, Volume3 } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  video: {
    position: "fixed",
    inset: 0,
    minWidth: "100%",
    minHeight: "100%",
  },

  muteButton: {
    backgroundColor: theme.colors[theme.primaryColor],
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 1000,
    bottom: 20,
    right: 20,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  skipButton: {
    backgroundColor: theme.colors[theme.primaryColor],
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 1000,
    bottom: 20,
    right: 100,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    color: "white",
  },

  panel: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
}));

export default function ExitExhibitor() {
  const { classes } = useStyles();
  const router = useRouter();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = document.getElementById(
      "exhibitor-video"
    ) as HTMLVideoElement;

    video.muted = !video.muted;
  }, []);

  return (
    <div className={classes.root}>
      <video
        id="exhibitor-video"
        autoPlay
        playsInline
        muted={muted}
        className={classes.video}
        onEnded={() => router.replace("/app/main-hall")}
      >
        {/* <source src="/hef-2022/video-exhibitor.mp4" type="video/mp4" /> */}
        <source
          src="https://res.cloudinary.com/darwxdfjz/video/upload/v1651042109/HEF-2022/scene5-compress_u9mkcn.mp4"
          type="video/mp4"
        />
      </video>
      <div className={classes.panel}>
        <UnstyledButton
          onClick={() => setMuted((prev) => !prev)}
          className={classes.muteButton}
        >
          {muted ? (
            <Volume3 size={30} color="white" />
          ) : (
            <Volume size={30} color="white" />
          )}
        </UnstyledButton>
        <UnstyledButton
          onClick={() => router.replace("/app/main-hall")}
          className={classes.skipButton}
        >
          Skip
        </UnstyledButton>
      </div>
    </div>
  );
}
