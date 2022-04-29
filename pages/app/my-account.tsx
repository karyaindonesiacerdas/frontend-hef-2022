import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Container, createStyles, Paper, Title } from "@mantine/core";

import { useAuth } from "contexts/auth.context";
import AppLayout from "@/components/app-layout/AppLayout";
import PersonalInformation from "@/components/my-account/PersonalInformation";
import ChangePassword from "@/components/my-account/ChangePassword";

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
  const { isAuthenticated, isInitialized } = useAuth();
  const { classes } = useStyles();

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
