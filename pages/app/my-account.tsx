import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Container,
  createStyles,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

import { useAuth } from "contexts/auth.context";
import AppLayout from "@/components/app-layout/AppLayout";
import PersonalInformation from "@/components/my-account/PersonalInformation";
import ChangePassword from "@/components/my-account/ChangePassword";
import { useActivityList } from "services/activity/hooks";
import { Trophy } from "tabler-icons-react";
import BottomNav from "@/components/app-layout/BottomNav";
import AppMobileLayout from "@/components/app-layout/AppMobileLayout";
import { useOs } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  root: {
    // backgroundImage: `linear-gradient(to bottom right, ${theme.colors["gray"][5]},${theme.colors["gray"][3]})`,
    background: theme.colors.gray[1],
    minHeight: "100vh",
    [theme.fn.smallerThan("lg")]: {
      paddingLeft: theme.spacing.xl * 3,
    },
    [theme.fn.smallerThan("xs")]: {
      paddingLeft: 0,
      overflow: "hidden",
    },
  },
  container: {
    [theme.fn.smallerThan("xs")]: {
      overflow: "auto",
      paddingBottom: 120,
      height: "100vh",
    },
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
  title: {
    fontSize: theme.fontSizes.xl * 1.2,
    [theme.fn.smallerThan("xs")]: {
      textAlign: "center",
    },
  },
}));

const MyAccount = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes } = useStyles();
  const os = useOs();

  const { data: activity } = useActivityList(1000);

  const isMobile = os === "android" || os === "ios";

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  const rewards = useMemo(() => activity?.data?.filter((reward: any) => !(
    ['booth', 'view_poster'].includes(reward.subject_name) &&
    (reward.subject === null || reward.subject.company_name === null)
  )) || [], [activity?.data])

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const getRewardLabel = (reward: any) => {
    if (reward.subject_name === 'register') return 'Registration';
    if (reward.subject_name === 'update_profile') return 'Profile Update';
    if (reward.subject_name === 'booth') return `Booth: ${reward.subject?.company_name}`;
    if (reward.subject_name === 'view_poster') return `Poster: ${reward.subject?.company_name}`;
    return reward.subject_name;
  }

  return (
    <div className={classes.root}>
      {isMobile ? (
        <div style={{ position: "absolute", top: 20, left: 16, zIndex: 100 }}>
          <AppMobileLayout />
        </div>
      ) : (
        <div
          style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}
          className={classes.sidebar}
        >
          <AppLayout />
        </div>
      )}

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

      <Container size="md" py="xl" className={classes.container}>
        <Title className={classes.title}>My Account</Title>
        <Paper
          withBorder
          shadow="xs"
          p="xl"
          component="section"
          mt="lg"
          style={{ position: "relative" }}
        >
          <PersonalInformation />
        </Paper>

        {user?.role === "visitor" && (
          <Paper
            mt="xl"
            withBorder
            shadow="xs"
            p="xl"
            component="section"
            style={{ position: "relative" }}
          >
            <Title
              sx={(theme) => ({
                fontSize: theme.fontSizes.lg,
                fontWeight: 500,
              })}
              order={2}
            >
              Reward ({rewards.length})
            </Title>
            <Group mt="md" spacing="xs">
              {rewards.map((reward: any, i: number) => (
                <Tooltip key={i} withArrow label={getRewardLabel(reward)}>
                  <Trophy size={36} color="#FFD700" cursor='pointer' />
                </Tooltip>
              ))}
            </Group>
          </Paper>
        )}

        <Paper
          mt="xl"
          withBorder
          shadow="xs"
          p="xl"
          component="section"
          style={{ position: "relative" }}
        >
          <ChangePassword />
        </Paper>
      </Container>
    </div>
  );
};

export default MyAccount;
