import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  AppShell,
  Container,
  createStyles,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { useRundowns } from "services/rundown/hooks";
import { formatDate } from "utils/date";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: theme.black,
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    "&:hover": {
      background: theme.colors[theme.primaryColor][0],
    },
  },
}));

const AdminWebinar: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const { data: rundowns } = useRundowns();

  const webinarDates: string[] = [];
  rundowns?.forEach((rundown) => {
    if (!webinarDates?.find((date) => rundown.date === date)) {
      webinarDates.push(rundown.date);
    }
  });

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const items = webinarDates?.map((date) => (
    <NextLink
      style={{ textDecoration: "none" }}
      key={date}
      href={`/admin/webinar/${date}`}
    >
      <Paper withBorder className={classes.link}>
        <Text size="xl" weight={700}>
          Rundown Webinar
        </Text>
        <Text size="lg" mt={7} weight={600}>
          {formatDate(date)}
        </Text>
      </Paper>
    </NextLink>
  ));

  return (
    <AppShell
      navbar={<AdminSidebar />}
      styles={(theme) => ({
        main: {
          height: "100vh",
          overflow: "auto",
          padding: theme.spacing.xs,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        },
      })}
    >
      <Container size={1700}>
        <Title order={2} px={3}>
          Webinar
        </Title>
        <SimpleGrid cols={3} className={classes.root}>
          {items}
        </SimpleGrid>
      </Container>
    </AppShell>
  );
};

export default AdminWebinar;
