import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import {
  Box,
  createStyles,
  Group,
  Image,
  keyframes,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { DoorEnter } from "tabler-icons-react";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import Marquee from "react-fast-marquee";

import { useSettings } from "services/settings/hooks";
import LeftAdvertisement from "@/components/main-hall/LeftAdvertisement";
import RightAdvertisement from "@/components/main-hall/RightAdvertisement";
import RunningText from "@/components/RunningText";
import BottomNav from "@/components/app-layout/BottomNav";
import Advertisement from "@/components/main-hall/Advertisement";
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
    // [theme.fn.smallerThan("xs")]: {
    //   display: "none",
    // },
  },
  sidebar: {
    display: "block",
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  bottomNav: {
    display: "none",
    [theme.fn.smallerThan("xs")]: {
      display: "block",
    },
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
  title: {
    fontSize: theme.fontSizes.xl * 1.2,
    textAlign: "center",
  },
  link: {
    backgroundColor: theme.colors[theme.primaryColor][0],
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    borderRadius: theme.radius.md,
    // border: "1px solid",
    // borderColor: theme.colors[theme.primaryColor][1],
    "&:hover": {
      backgroundColor: theme.colors[theme.primaryColor][1],
    },
  },
  linkText: {
    fontSize: theme.fontSizes.lg,
    textAlign: "center",
    fontWeight: 600,
    color: theme.colors[theme.primaryColor][9],
  },
}));

const MainHall = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { isAuthenticated, isInitialized } = useAuth();
  const { classes } = useStyles();
  const [value, setValue] = useLocalStorage({
    key: "skip-enter",
    defaultValue: false,
  });
  const largerThanXs = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);

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
      <div
        style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}
        className={classes.sidebar}
      >
        <AppLayout />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 50,
          width: "100%",
        }}
        className={classes.bottomNav}
      >
        <BottomNav />
      </div>

      <Box
        style={{
          position: "absolute",
          // inset: 0,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
        }}
      >
        <RunningText />
      </Box>

      {largerThanXs ? (
        <div className={classes.container}>
          <LeftAdvertisement url={settings?.ads1_link} />
          <RightAdvertisement url={settings?.ads2_link} />
          <div className={classes.virtualExhibitionLinkContainer}>
            <NextLink
              className={classes.virtualExhibitionLink}
              href={value ? "/app/exhibitor" : "/app/enter-exhibitor"}
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
      ) : (
        <Stack mt={55}>
          <Title className={classes.title}>Welcome to HEF 2022</Title>
          <Advertisement url={settings?.ads1_link} />
          <SimpleGrid mt={20} cols={2} px="sm" spacing={10}>
            <UnstyledButton
              className={classes.link}
              onClick={() => router.push("/app/seminar")}
            >
              <Stack align="center">
                <Text align="center" className={classes.linkText}>
                  Webinar
                </Text>
                {/* <DoorEnter color={theme.colors[theme.primaryColor][9]} /> */}
              </Stack>
            </UnstyledButton>
            <UnstyledButton
              className={classes.link}
              onClick={() => router.push("/app/exhibitor")}
            >
              <Stack align="center">
                <Text align="center" className={classes.linkText}>
                  Virtual Exhibition
                </Text>
                {/* <DoorEnter color={theme.colors[theme.primaryColor][9]} /> */}
              </Stack>
            </UnstyledButton>
          </SimpleGrid>
        </Stack>
      )}
    </div>
  );
};

export default MainHall;
