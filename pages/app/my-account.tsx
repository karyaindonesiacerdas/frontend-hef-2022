import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  createStyles,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";

import { useAuth } from "contexts/auth.context";
import AppLayout from "@/components/app-layout/AppLayout";
import PersonalInformation from "@/components/my-account/PersonalInformation";
import ChangePassword from "@/components/my-account/ChangePassword";
import { useActivityList } from "services/activity/hooks";
import { Trophy } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundImage: `linear-gradient(to bottom right, ${theme.colors["gray"][5]},${theme.colors["gray"][3]})`,
    height: "100vh",
  },
  title: {
    fontSize: theme.fontSizes.xl * 1.2,
  },
}));

const MyAccount = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes } = useStyles();

  const { data: activity } = useActivityList();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div>
      <Container size="md" py="xl">
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
              Reward
            </Title>
            <Group mt="md" spacing="xs">
              {activity?.data?.map((_: any, i: number) => (
                <Trophy key={i} size={36} color="	#FFD700" />
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
