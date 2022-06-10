import React, { useEffect, useState } from "react";
import { createStyles, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { Volume, Volume3 } from "tabler-icons-react";
import { useLocalStorage } from "@mantine/hooks";
import { useAuth } from "contexts/auth.context";

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

export default function EnterExhibitor() {
  const { classes } = useStyles();
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [muted, setMuted] = useState(true);
  const [value, setValue] = useLocalStorage({
    key: "skip-enter",
    defaultValue: false,
  });

  // useEffect(() => {
  //   if (isInitialized && isAuthenticated && user?.role !== "admin") {
  //     router.replace("/app/main-hall");
  //   }
  // }, [router, isInitialized, isAuthenticated, user?.role]);

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
        onEnded={() => router.replace("/app/exhibitor")}
      >
        {/* <source src="/hef-2022/video-exhibitor.mp4" type="video/mp4" /> */}
        <source
          src="https://res.cloudinary.com/darwxdfjz/video/upload/v1651035331/HEF-2022/video-exhibitor_unf2y7.mp4"
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
          onClick={() => {
            setValue(true);
            router.replace("/app/exhibitor");
          }}
          className={classes.skipButton}
        >
          Skip
        </UnstyledButton>
      </div>
    </div>
  );
}
