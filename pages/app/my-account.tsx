import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  createStyles,
  Group,
  Paper,
  Title,
  Tooltip,
} from "@mantine/core";

import { useAuth } from "contexts/auth.context";
import AppLayout from "@/components/app-layout/AppLayout";
import PersonalInformation from "@/components/my-account/PersonalInformation";
import ChangePassword from "@/components/my-account/ChangePassword";
import { postActivity } from "services/activity/activity";
import { useActivityList } from "services/activity/hooks";
import { usePackages } from "services/package/hooks/usePackages";
import { Trophy } from "tabler-icons-react";
import RewardModal from "@/components/RewardModal";
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
  const [rewardVisibility, setRewardVisibility] = useState(false);

  const { data: activity } = useActivityList(1000);
  const { data: packages } = usePackages();

  const isMobile = os === "android" || os === "ios";

  const postReward = useCallback(async (id: number) => {
    try {
      if (user?.id) {
        await postActivity({
          subject_id: id,
          subject_type: "reward",
          subject_name: "webinar",
          causer_id: user.id,
        });
        setRewardVisibility(true);
      }
    } catch (error) { }
  }, [user?.id]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  useEffect(() => {
    if (router.query?.from) {
      const surveyMapper: Record<any, number> = {
        '/survey/rehabilitasi-medis': 6,
        '/survey/smart-hospital': 3,
      };
      const from = Array.isArray(router.query.from) ? router.query.from.at(0) : router.query.from;
      const surveyId = surveyMapper[from || ''];
      if (surveyId) {
        postReward(surveyId);
      }
    }
  }, [router.query, postReward]);

  const rewards = useMemo(() => activity?.data?.filter((reward: any) => !(
    ['booth', 'view_poster'].includes(reward.subject_name) &&
    (reward.subject === null || reward.subject.company_name === null)
  )) || [], [activity?.data]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const getRewardLabel = (reward: any) => {
    if (reward.subject_name === 'register') return 'Registration';
    if (reward.subject_name === 'update_profile') return 'Profile Update';
    if (reward.subject_name === 'booth') return `Booth: ${reward.subject?.company_name}`;
    if (reward.subject_name === 'view_poster') return `Poster: ${reward.subject?.company_name}`;
    if (reward.subject_name === 'webinar') {
      const webinarName = packages?.filter(p => p.id === reward.subject_id)?.at(0)?.name;
      return `Webinar: ${webinarName || reward.subject_id}`;
    }
    return reward.subject_name;
  }

  const getRewardColor = (reward: any) => {
    if (reward.subject_name === 'booth') return '#008ffb';
    if (reward.subject_name === 'view_poster') return '#00e396';
    if (reward.subject_name === 'webinar') return '#feb019';
    return "#ff4560";
  }

  return (
    <div className={classes.root}>
      <RewardModal
        msg={{
          en: 'You get points for completing webinar survey',
          id: 'Anda mendapatkan point karena telah berpartisipasi dalam webinar dan mengisi survey terkait webinar tersebut'
        }}
        visible={rewardVisibility}
        onClose={() => setRewardVisibility(false)}
      />
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
                  <Trophy size={36} color={getRewardColor(reward)} cursor='pointer' />
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
