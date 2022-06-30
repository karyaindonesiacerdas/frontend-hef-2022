import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  createStyles,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { useForm, formList } from "@mantine/form";
import { useQueryClient } from "react-query";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import UploadedImageInput, { ImageType } from "components/dropzone/UploadedImageInput";
import { useAuth } from "contexts/auth.context";
import type { ImageItemType } from "services/settings";
import { useSettings } from "services/settings/hooks";
import { updateAppSettings, UpdateAppSettingsPayload } from "services/settings";
import { Trash } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  paper: {
    position: "relative",
  },
}));

const DoorprizeSettings: NextPage = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const singleImageItemList: Array<ImageItemType> = useMemo(() => [
    { id: 0, name: '', image: { src: '', filename: '' } }
  ], []);


  const form = useForm({
    initialValues: {
      randomizer_time: 5000,
      sponsors: formList(singleImageItemList),
      rewards: formList(singleImageItemList),
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
      randomizer_time: settings?.doorprize?.randomizer_time || 5000,
      sponsors: formList(settings?.doorprize?.sponsors || singleImageItemList),
      rewards: formList(settings?.doorprize?.rewards || singleImageItemList),
    });
  }, [setValues, settings, singleImageItemList]);

  const setSponsorImage = (image: ImageType, i = 0) => {
    form.setListItem('sponsors', i, { ...form.values.sponsors[i], image })
  }

  const setRewardImage = (image: ImageType, i = 0) => {
    form.setListItem('rewards', i, { ...form.values.rewards[i], image })
  }

  const handleSubmit = async (values: typeof form.values) => {
    const payload: UpdateAppSettingsPayload = {
      ads1_link: settings?.ads1_link || '',
      ads2_link: settings?.ads2_link || '',
      webinar_link: settings?.webinar_link || '',
      youtube_link: settings?.youtube_link || '',
      zoom_business_link: settings?.zoom_business_link || '',
      zoom_link: settings?.zoom_link || '',
      is_chat: settings?.is_chat === '1' ? 1 : 0,
      doorprize: {
        ...settings?.doorprize,
        randomizer_time: parseInt(String(values.randomizer_time), 10),
        sponsors: values.sponsors.map((item, id) => ({ ...item, id })),
        rewards: values.rewards.map((item, id) => ({ ...item, id })),
      }
    };
    setLoading(true);
    try {
      await updateAppSettings(payload);
      await queryClient.invalidateQueries("settings");
      notifications.showNotification({
        title: "Success",
        message: "Doorprize settings updated!",
        color: "green",
      });
    } catch (error: any) {
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
    setLoading(false);
  };

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const rewardFields = form.values.rewards.map((item, i) => (
    <Group key={i} mt="xs" align="baseline">
      <TextInput
        label="Reward Name"
        required
        sx={{ flex: 1 }}
        {...form.getListInputProps('rewards', i, 'name')}
      />
      <UploadedImageInput
        image={item.image}
        setImage={image => setRewardImage(image, i)}
        required
      />
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem('rewards', i)}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>
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
          Doorprize Settings
        </Title>
        <div className={classes.root}>
          <Paper withBorder p="md" className={classes.paper}>
            <LoadingOverlay visible={loading} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                required
                label="Randomizer Time (ms)"
                mb="sm"
                {...form.getInputProps("randomizer_time")}
              />
              <UploadedImageInput
                label="Sponsor Logo"
                image={form.values.sponsors[0].image}
                setImage={image => setSponsorImage(image, 0)}
                required
              />
              <Divider mb="sm" label="Rewards" />
              {rewardFields}
              <Group position="center" mt="md">
              </Group>
              <Divider mb="sm" />

              <Button
                onClick={() =>
                  form.addListItem('rewards', { id: form.values.rewards.length, name: '', image: { src: '', filename: '' } })
                }
                mr={8}
              >
                Add Reward
              </Button>
              <Button type="submit">Save</Button>
            </form>
          </Paper>
        </div>
      </Container>
    </AppShell>
  );
};

export default DoorprizeSettings;
