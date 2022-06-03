import React, { useState } from "react";
import {
  Box,
  Button,
  createStyles,
  Group,
  LoadingOverlay,
  PasswordInput,
  SimpleGrid,
  Title,
} from "@mantine/core";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { changePassword } from "services/auth.service";
import { useRouter } from "next/router";
import { useNotifications } from "@mantine/notifications";
import { useAuth } from "contexts/auth.context";

const useStyles = createStyles((theme) => ({
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
  },
}));

const schema = z.object({
  currentPassword: z.string().nonempty(),
  newPassword: z.string().nonempty(),
});

const ChangePassword = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();
  const { logout } = useAuth();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setVisible(true);
    try {
      await changePassword(values.newPassword);
      notifications.showNotification({
        title: "Success",
        message: "Password changed successfully",
        color: "green",
      });
      await logout();
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error change password",
        color: "red",
      });
    }
  };

  return (
    <>
      <LoadingOverlay visible={visible} />
      <Title className={classes.sectionTitle} order={2}>
        Change Password
      </Title>
      <Box mt="md" component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          <PasswordInput
            label="Current Password"
            placeholder="Current Password"
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeCheck size={size} /> : <EyeOff size={size} />
            }
            {...form.getInputProps("currentPassword")}
          />
          <PasswordInput
            label="New Password"
            placeholder="New Password"
            visibilityToggleIcon={({ reveal, size }) =>
              reveal ? <EyeCheck size={size} /> : <EyeOff size={size} />
            }
            {...form.getInputProps("newPassword")}
          />
        </SimpleGrid>
        <Group mt="md" position="right">
          <Button type="submit">Change</Button>
        </Group>
      </Box>
    </>
  );
};

export default ChangePassword;
