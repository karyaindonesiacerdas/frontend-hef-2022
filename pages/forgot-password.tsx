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
  Image,
} from "@mantine/core";
import { useRouter } from "next/router";
import { ArrowLeft } from "tabler-icons-react";
import Link from "next/link";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useNotifications } from "@mantine/notifications";
import { userResetPassword } from "services/auth.service";
import { NextLink } from "@mantine/next";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 700,
    [theme.fn.smallerThan("sm")]: {
      fontSize: theme.fontSizes.xl,
    },
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

  logoTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor][6],
  },

  form: {
    borderRadius: theme.radius.lg,
    // borderLeft: `1px solid ${
    //   theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    // }`,
    maxWidth: 600,
    overflow: "auto",
    padding: theme.spacing.xl,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
    margin: "0 auto",
  },
}));

const schema = z.object({
  mobileOrEmail: z.string().nonempty(),
});

export default function ForgotPasswordPage() {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();
  const router = useRouter();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      mobileOrEmail: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setVisible(true);
      await userResetPassword(values.mobileOrEmail);
      notifications.showNotification({
        title: "Success",
        message: "Your new password is 12345",
        color: "green",
      });
      setVisible(false);
      router.replace("/app");
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
    <Container size={450} my={30}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper
          withBorder
          shadow="md"
          radius="md"
          mt="xl"
          className={classes.form}
          sx={{ position: "relative" }}
        >
          <LoadingOverlay visible={visible} />
          <NextLink
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 10,
              textDecoration: "none",
            }}
          >
            <Image
              width={42}
              height={42}
              style={{ flexShrink: 0 }}
              src="/logo.png"
              alt="Logo HEF"
            />
            <Text className={classes.logoTitle}>HEF 2022</Text>
          </NextLink>
          <Title className={classes.title} align="center">
            Forgot your password?
          </Title>
          <Text color="dimmed" size="sm" align="center" mb="md">
            Enter your phone or email to reset password
          </Text>
          <TextInput
            label="Your phone or email"
            placeholder="me@mantine.dev"
            required
            {...form.getInputProps("mobileOrEmail")}
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
