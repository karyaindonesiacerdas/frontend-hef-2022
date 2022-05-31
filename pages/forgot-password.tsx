import React, { useState } from "react";
import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { ArrowLeft } from "tabler-icons-react";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useNotifications } from "@mantine/notifications";
import { userResetPassword } from "services/auth.service";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

const schema = z.object({
  email: z.string().email().nonempty(),
});

export default function ForgotPasswordPage() {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setVisible(true);
      await userResetPassword(values.email);
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Check your email",
        color: "green",
      });
      form.reset();
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    } finally {
    }
  };

  return (
    <Container size={450} my={40}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your email to reset password
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          mt="xl"
          sx={{ position: "relative" }}
        >
          <LoadingOverlay visible={visible} />
          <TextInput
            label="Your email"
            placeholder="me@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Link href="/login" passHref>
              <Anchor color="dimmed" size="sm" className={classes.control}>
                <Center inline>
                  <ArrowLeft size={12} />
                  <Box ml={5}>Back to login page</Box>
                </Center>
              </Anchor>
            </Link>
            <Button type="submit" className={classes.control}>
              Reset password
            </Button>
          </Group>
        </Paper>
      </form>
    </Container>
  );
}
