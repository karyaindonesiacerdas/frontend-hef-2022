import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import { createStyles, keyframes } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { DoorEnter } from "tabler-icons-react";
import { useSettings } from "services/settings/hooks";
import LeftAdvertisement from "@/components/main-hall/LeftAdvertisement";
import RightAdvertisement from "@/components/main-hall/RightAdvertisement";
// import ChatButton from "@/components/chat/ChatButton";

export const pulse = keyframes({
  "from, to": { opacity: 1 },
  "30%, 50%, 70%": { opacity: 0.3 },
});

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url('/hef-2022/main-hall.jpg')",
    width: "100%",
    height: "100%",
    aspectRatio: "2 / 1",
  },
  virtualExhibitionLinkContainer: {
    position: "absolute",
    width: "11.25%",
    height: "19%",
    top: "33%",
    left: "11.5%",
    perspective: "300px",
    perspectiveOrigin: "left",
  },
  virtualExhibitionLink: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    opacity: 0.2,
    transform: "rotateY(10deg) rotateZ(0deg) skewY(3deg)",
    textDecoration: "none",
    color: theme.colors[theme.primaryColor][6],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.3vw",
    fontWeight: 600,
    border: "4px solid teal",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    cursor: "pointer",
    "&:hover": {
      animation: "none",
      opacity: 1,
    },
  },
  seminarHallLinkContainer: {
    position: "absolute",
    width: "11.25%",
    height: "19%",
    top: "33%",
    right: "11.25%",
    perspective: "300px",
    perspectiveOrigin: "right",
  },
  seminarHallLink: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    opacity: 0.2,
    transform: "rotateY(-10deg) rotateZ(0deg) skewY(-3deg)",
    textDecoration: "none",
    color: theme.colors[theme.primaryColor][6],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.3vw",
    fontWeight: 600,
    border: "4px solid teal",
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
    cursor: "pointer",
    "&:hover": {
      animation: "none",
      opacity: 1,
    },
  },
}));

const MainHall = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const { classes } = useStyles();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  const { data: settings } = useSettings();

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div>
      <div className={classes.container}>
        <LeftAdvertisement url={settings?.ads1_link} />
        <RightAdvertisement url={settings?.ads2_link} />
        <div className={classes.virtualExhibitionLinkContainer}>
          <NextLink
            className={classes.virtualExhibitionLink}
            href="/app/enter-exhibitor"
            style={{ textAlign: "center" }}
          >
            <span>Enter</span>
            <DoorEnter style={{ marginLeft: 8 }} size={"2vw"} />
          </NextLink>
        </div>
        <div className={classes.seminarHallLinkContainer}>
          <NextLink
            className={classes.seminarHallLink}
            href="/app/seminar"
            style={{ textAlign: "center" }}
          >
            <span>Enter</span>
            <DoorEnter style={{ marginLeft: 8 }} size={"2vw"} />
          </NextLink>
        </div>
        {/* <ChatButton /> */}
      </div>
    </div>
  );
};

export default MainHall;
