import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  AppShell,
  Button,
  Container,
  createStyles,
  LoadingOverlay,
  Paper,
  TextInput,
  Title,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { resetPassword } from "services/auth.service";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  paper: {
    maxWidth: theme.breakpoints.xs,
    position: "relative",
  },
}));

const schema = z.object({
  email: z.string().email().nonempty(),
});

const AdminSettingsResetPassword: NextPage = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const handleSubmit = async (values: typeof form.values) => {
    setVisible(true);
    try {
      await resetPassword(values.email);
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Password reset successfully",
        color: "green",
      });
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
  };

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

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
          Reset Password
        </Title>
        <div className={classes.root}>
          <Paper withBorder p="md" className={classes.paper}>
            <LoadingOverlay visible={visible} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                required
                label="Email"
                mb="sm"
                {...form.getInputProps("email")}
              />

              <Button type="submit">Reset Password</Button>
            </form>
          </Paper>
        </div>
      </Container>
    </AppShell>
  );
};

export default AdminSettingsResetPassword;
