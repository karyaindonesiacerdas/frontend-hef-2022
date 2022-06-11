import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Center,
  createStyles,
  Group,
  Image,
  keyframes,
  List,
  ScrollArea,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import SeminarScreen from "@/components/seminar/SeminarScreen";
import SeminarRundown from "@/components/seminar/SeminarRundown";
import { Award, Trophy } from "tabler-icons-react";
import { useRundownClosing, useRundowns } from "services/rundown/hooks";
import { postActivity } from "services/activity/activity";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import RunningText from "@/components/RunningText";
import BottomNav from "@/components/app-layout/BottomNav";
import { useMediaQuery, useOs } from "@mantine/hooks";
import MobileSeminarScreen from "@/components/seminar/MobileSeminarScreen";
import AppMobileLayout from "@/components/app-layout/AppMobileLayout";
import { useSettings } from "services/settings/hooks";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100vh",
    // overflow: "hidden",
    overflow: "auto",
  },
  container: {
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url('/hef-2022/seminar-hall.jpg')",
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
  rundownButtonContainer: {
    position: "absolute",
  },
  rundownButton: {
    width: 85,
    height: 85,
    position: "fixed",
    top: 50,
    right: 55,
    borderRadius: 1000,
    backgroundColor: theme.colors[theme.primaryColor][0],
    opacity: 0.8,
    color: theme.colors[theme.primaryColor][6],
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    border: "4px solid teal",
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
  listItem: {
    marginBottom: 10,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[0],
  },
  current: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    fontWeight: 500,
    color: "white",
  },
  link: {
    transition: "all",
    transitionDuration: "0.1s",
    "&:hover": {
      transform: "translateY(-3px)",
    },
  },
}));

export const bounce = keyframes({
  "from, 20%, 53%, 80%, to": { transform: "translate3d(0, 0, 0)" },
  "40%, 43%": { transform: "translate3d(0, -20px, 0)" },
  "70%": { transform: "translate3d(0, -10px, 0)" },
  "90%": { transform: "translate3d(0, -2px, 0)" },
});

const Seminar = () => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes, cx } = useStyles();
  const [openRundown, setOpenRundown] = useState(true);
  const queryClient = useQueryClient();
  const [collecting, setCollecting] = useState(false);
  const notifications = useNotifications();
  const largerThanXs = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);
  const os = useOs();

  const isMobile = os === "android" || os === "ios";

  const { data: rundown } = useRundownClosing();
  console.log({ rundown });
  const { data: settings } = useSettings();
  console.log({ settings });

  const handlePostActivity = async () => {
    if (rundown?.isJoined !== 0 || !rundown?.id || !user?.id) return;

    try {
      setCollecting(true);
      await postActivity({
        subject_id: rundown?.id,
        subject_type: "award",
        subject_name: `webinar-${rundown?.id}`,
        causer_id: user?.id,
      });
      await queryClient.invalidateQueries(["rundowns-closing"]);
      notifications.showNotification({
        title: "Success",
        message: "Award collected!",
      });
      setCollecting(false);
    } catch (error) {
      setCollecting(false);
    }
  };

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    }
  }, [router, isInitialized, isAuthenticated]);

  // useEffect(() => {
  //   if (isInitialized && isAuthenticated && user?.role !== "admin") {
  //     router.replace("/app/main-hall");
  //   }
  // }, [router, isInitialized, isAuthenticated, user?.role]);
  const { data: rundowns } = useRundowns();

  const todayRundowns = rundowns?.filter(
    (rundown) => rundown.date === new Date().toISOString().split("T")[0]
  );

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      {largerThanXs && !isMobile ? (
        <div
          style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}
          className={classes.sidebar}
        >
          <AppLayout />
        </div>
      ) : isMobile && largerThanXs ? (
        <div style={{ position: "absolute", top: 40, left: 16, zIndex: 100 }}>
          <AppMobileLayout />
        </div>
      ) : null}

      {settings?.zoom_business_link ? (
        <Group
          sx={{
            position: "absolute",
            bottom: 20,
            zIndex: 1000,
            width: "98vw",
            [theme.fn.smallerThan("xs")]: {
              bottom: 85,
              width: "100vw",
            },
          }}
          position="center"
        >
          <Button
            size="xl"
            sx={{
              backgroundColor: "#2D8CFF",
              "&:hover": {
                backgroundColor: "#2D8CFF",
                opacity: 0.9,
              },
            }}
            component="a"
            href={settings?.zoom_business_link}
            pl="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group>
              <Image width={30} src="/hef-2022/zoom.png" alt="zoom" />
              <Text size="lg">Join Zoom</Text>
            </Group>
          </Button>
        </Group>
      ) : null}
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
        <>
          <div className={classes.container}>
            <SeminarScreen />
            {os === "android" || os === "ios" ? null : (
              <>
                <SeminarRundown
                  opened={openRundown}
                  setOpened={setOpenRundown}
                />
                <div className={classes.rundownButtonContainer}>
                  <UnstyledButton
                    className={classes.rundownButton}
                    onClick={() => setOpenRundown((prev) => !prev)}
                  >
                    {openRundown ? "Close" : "Open"} Rundown
                  </UnstyledButton>
                </div>
              </>
            )}
          </div>
          {rundown?.isJoined === 0 && (
            <UnstyledButton
              sx={{
                position: "absolute",
                bottom: 50,
                right: 50,
                width: 80,
                height: 80,
                backgroundColor: theme.colors.orange[5],
                borderRadius: 80,
                animation: `${bounce} 3s ease-in-out infinite`,
                "&:hover": {
                  backgroundColor: theme.colors.orange[3],
                },
              }}
              onClick={handlePostActivity}
            >
              <Center>
                <Stack spacing={0} align="center">
                  <Trophy size={30} />
                  <Text align="center" size="xs" weight={600}>
                    {collecting ? "Collecting..." : "Collect Reward"}
                  </Text>
                </Stack>
              </Center>
            </UnstyledButton>
          )}
        </>
      ) : (
        <div className={classes.root}>
          <Stack mt={55} mb={100}>
            <Title className={classes.title}>Webinar</Title>
            <MobileSeminarScreen />
            <Stack px="md">
              <Text weight={600} pl={10} color="teal">
                Rundown
              </Text>
              {/* <ScrollArea> */}
              <List listStyleType="none" spacing="xs">
                {todayRundowns?.map((rundown, i) => (
                  <li
                    key={rundown.id}
                    className={cx(classes.listItem, {
                      [classes.current]: rundown.status === 2,
                    })}
                    value={rundown.status}
                  >
                    {rundown.status === 2 ? (
                      <Group align="center" position="apart">
                        <Text>{rundown.time}</Text>
                        <Badge>Live</Badge>
                      </Group>
                    ) : (
                      <Text>{rundown.time}</Text>
                    )}
                    <Text weight={600}>{rundown.title}</Text>
                    <Text size="sm">{rundown.speakers}</Text>
                    {rundown.status === 2 && (
                      <Group position="right" spacing="md">
                        {/* <Anchor
                            href={settings?.youtube_link}
                            target="_blank"
                            className={classes.link}
                          >
                            <Image
                              src="/hef-2022/youtube.png"
                              alt="Link youtube live"
                              width={30}
                            />
                          </Anchor> */}
                        <Anchor
                          href={settings?.zoom_link}
                          target="_blank"
                          className={classes.link}
                        >
                          <Image
                            src="/hef-2022/zoom.png"
                            alt="Link zoom"
                            width={30}
                          />
                        </Anchor>
                      </Group>
                    )}
                  </li>
                ))}
              </List>
              {/* </ScrollArea> */}
            </Stack>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default Seminar;
