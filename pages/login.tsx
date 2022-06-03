import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Container,
  Group,
  Button,
  SimpleGrid,
  Divider,
  LoadingOverlay,
  createStyles,
  Image,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useAuth } from "contexts/auth.context";
import { NextLink } from "@mantine/next";
import { GetStaticPropsContext } from "next";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    paddingTop: theme.spacing.xl,
    // backgroundImage: `linear-gradient(to bottom right, ${
    //   theme.colors[theme.primaryColor][6]
    // },${theme.colors[theme.primaryColor][3]})`,
    backgroundColor: theme.colors.gray[1],

    // backgroundColor: theme.colors[theme.primaryColor][6],
  },
  logoTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor][6],
  },
}));

const schema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty(),
});

export default function LoginPage() {
  const { classes } = useStyles();
  const router = useRouter();
  const notifications = useNotifications();
  const { login, isAuthenticated, isInitialized } = useAuth();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("auth");

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/app");
    }
  }, [router, isInitialized, isAuthenticated]);

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setVisible(true);
    try {
      await login(values);
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

  if (!isInitialized || isAuthenticated) {
    return null;
  }

  console.log({ t });

  return (
    <div className={classes.wrapper}>
      <Container size={500}>
        {/* <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title> */}

        <Paper
          withBorder
          shadow="md"
          p={30}
          // mt={30}
          radius="md"
          style={{ position: "relative" }}
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
          <Title align="center" order={2} mb="md">
            {t("login-tag")}
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              required
              label={t("email")}
              placeholder="me@example.com"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              required
              label={t("password")}
              placeholder="password"
              mt="md"
              {...form.getInputProps("password")}
            />
            <Group position="right" mt="md">
              {/* <Checkbox label="Remember me" /> */}
              <Link href="/forgot-password" passHref>
                <Anchor component="a" size="sm">
                  Forgot password?
                </Anchor>
              </Link>
            </Group>
            <Button type="submit" fullWidth mt="md" mb="md">
              {t("login")}
            </Button>
          </form>

          <Divider my="xs" label="Or" labelPosition="center" />

          <SimpleGrid
            cols={2}
            mt="md"
            breakpoints={[{ maxWidth: "xs", cols: 1 }]}
          >
            <Link href="/register/exhibitor" passHref>
              <Button component="a" variant="outline">
                {t("register-as-exhibitor")}
              </Button>
            </Link>
            <Link href="/register/visitor" passHref>
              <Button component="a" variant="outline">
                {t("register-as-visitor")}
              </Button>
            </Link>
          </SimpleGrid>
        </Paper>
      </Container>
    </div>
  );
}

export const getStaticProps = async ({
  locale = "en",
}: GetStaticPropsContext) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "auth"])),
  },
});
