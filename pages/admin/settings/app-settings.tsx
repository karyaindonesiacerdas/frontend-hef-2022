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
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQueryClient } from "react-query";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { useSettings } from "services/settings/hooks";
import { updateAppSettings, UpdateAppSettingsPayload } from "services/settings";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  paper: {
    maxWidth: theme.breakpoints.sm,
    position: "relative",
  },
}));

const schema = z.object({
  youtube_link: z.string().nonempty(),
  zoom_business_link: z.string().nonempty(),
  zoom_link: z.string().nonempty(),
  ads1_link: z.string().nonempty(),
  ads2_link: z.string().nonempty(),
  webinar_link: z.string().nonempty(),
  is_chat: z.boolean(),
});

const AdminSettingsAppSettings: NextPage = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      youtube_link: "",
      zoom_business_link: "",
      zoom_link: "",
      ads1_link: "",
      ads2_link: "",
      webinar_link: "",
      is_chat: false,
    },
  });
  const { setValues } = form;

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const { data: settings } = useSettings();

  useEffect(() => {
    setValues({
      ads1_link: settings?.ads1_link || "",
      ads2_link: settings?.ads2_link || "",
      webinar_link: settings?.webinar_link || "",
      youtube_link: settings?.youtube_link || "",
      zoom_business_link: settings?.zoom_business_link || "",
      zoom_link: settings?.zoom_link || "",
      is_chat: settings?.is_chat === "1" ? true : false,
    });
  }, [setValues, settings]);

  const handleSubmit = async (values: typeof form.values) => {
    const payload: UpdateAppSettingsPayload = {
      ads1_link: values.ads1_link,
      ads2_link: values.ads2_link,
      webinar_link: values.webinar_link,
      youtube_link: values.youtube_link,
      zoom_business_link: values.zoom_business_link,
      zoom_link: values.zoom_link,
      is_chat: values.is_chat ? 1 : 0,
    };

    setVisible(true);
    try {
      await updateAppSettings(payload);
      await queryClient.invalidateQueries("settings");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "App settings updated!",
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
          App Settings
        </Title>
        <div className={classes.root}>
          <Paper withBorder p="md" className={classes.paper}>
            <LoadingOverlay visible={visible} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                required
                label="Youtube Live Link"
                mb="sm"
                {...form.getInputProps("youtube_link")}
              />
              <TextInput
                required
                label="Zoom Webinar Link"
                mb="sm"
                {...form.getInputProps("zoom_link")}
              />
              <TextInput
                required
                label="Zoom Business Matching Link"
                mb="sm"
                {...form.getInputProps("zoom_business_link")}
              />
              <TextInput
                required
                label="Main Video (Youtube Link)"
                mb="sm"
                {...form.getInputProps("webinar_link")}
              />
              <TextInput
                required
                label="Advertisement 1 (Youtube Link)"
                mb="sm"
                {...form.getInputProps("ads1_link")}
              />
              <TextInput
                required
                label="Advertisement 2 (Youtube Link)"
                mb="sm"
                {...form.getInputProps("ads2_link")}
              />
              <Switch
                size="md"
                label="Chat"
                mb="sm"
                defaultChecked={settings?.is_chat === "1"}
                {...form.getInputProps("is_chat")}
              />
              <Button type="submit">Save</Button>
            </form>
          </Paper>
        </div>
      </Container>
    </AppShell>
  );
};

export default AdminSettingsAppSettings;
