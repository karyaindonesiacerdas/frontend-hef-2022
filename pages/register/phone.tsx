import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  TextInput,
  Paper,
  Title,
  Container,
  Button,
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
// import { registerWithPhone } from "services/auth.service";

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
  mobile: z.string().nonempty(),
});

export default function RegisterWithPhonePage() {
  const { classes } = useStyles();
  const router = useRouter();
  const notifications = useNotifications();
  const { isAuthenticated, isInitialized, registerWithPhone } = useAuth();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("auth");

  useEffect(() => {
    try {
      fetch("/api/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "Register with Phone" }),
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/app");
    }
  }, [router, isInitialized, isAuthenticated]);

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      mobile: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setVisible(true);
    try {
      // await registerWithPhone(values.mobile);
      await registerWithPhone(values.mobile);
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: t("success-register-with-phone"),
        color: "green",
        autoClose: false,
      });
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
            {t("register-with-phone")}
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              required
              label={t("mobile")}
              placeholder="081234567890"
              autoCapitalize="false"
              type="number"
              {...form.getInputProps("mobile")}
            />
            <Button type="submit" fullWidth mt="md" mb="md">
              {t("register")}
            </Button>
          </form>
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
