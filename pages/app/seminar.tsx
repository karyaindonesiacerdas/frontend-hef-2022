import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import {
  Center,
  createStyles,
  keyframes,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import SeminarScreen from "@/components/seminar/SeminarScreen";
import SeminarRundown from "@/components/seminar/SeminarRundown";
import { Award, Trophy } from "tabler-icons-react";
import { useRundownClosing } from "services/rundown/hooks";
import { postActivity } from "services/activity/activity";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url('/hef-2022/seminar-hall.jpg')",
    width: "100%",
    height: "100%",
    aspectRatio: "2 / 1",
  },
  rundownButtonContainer: {
    position: "absolute",
  },
  rundownButton: {
    width: 85,
    height: 85,
    position: "fixed",
    top: 40,
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
  const { classes } = useStyles();
  const [openRundown, setOpenRundown] = useState(true);
  const queryClient = useQueryClient();
  const [collecting, setCollecting] = useState(false);
  const notifications = useNotifications();

  const { data: rundown } = useRundownClosing();
  console.log({ rundown });

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
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div>
      <div className={classes.container}>
        <SeminarScreen />
        <SeminarRundown opened={openRundown} setOpened={setOpenRundown} />
        <div className={classes.rundownButtonContainer}>
          <UnstyledButton
            className={classes.rundownButton}
            onClick={() => setOpenRundown((prev) => !prev)}
          >
            {openRundown ? "Close" : "Open"} Rundown
          </UnstyledButton>
        </div>
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
    </div>
  );
};

export default Seminar;
