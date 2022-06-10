import React, { useEffect, useState } from "react";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Select,
  CheckboxGroup,
  SimpleGrid,
  Divider,
  Container,
  List,
  ThemeIcon,
  Image,
  LoadingOverlay,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { CircleCheck } from "tabler-icons-react";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useAuth } from "contexts/auth.context";
import { countries } from "data/countries";
import { useForm, zodResolver } from "@mantine/form";
import { provinces } from "data/provinces";
import { RegisterInputs } from "services/auth.service";
import { useNotifications } from "@mantine/notifications";
import { usePackages } from "services/package/hooks/usePackages";

const useStyles = createStyles((theme) => ({
  // wrapper: {
  //   minHeight: "100vh",
  //   backgroundSize: "cover",
  //   backgroundImage:
  //     "url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80)",
  //   display: "flex",
  //   justifyContent: "flex-end",
  // },
  wrapper: {
    // display: "flex",
    // justifyContent: "center",
    padding: theme.spacing.xl,
    // backgroundImage: `linear-gradient(to bottom right, ${
    //   theme.colors[theme.primaryColor][6]
    // },${theme.colors[theme.primaryColor][3]})`,
    backgroundColor: theme.colors.gray[1],
    [theme.fn.smallerThan("sm")]: {
      padding: theme.spacing.sm,
    },
  },

  infoContainer: {
    padding: theme.spacing.xl * 2,
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },

  infoTitle: {
    fontSize: theme.fontSizes.xl * 1.3,
    fontWeight: 700,
    color: theme.colors["gray"][9],
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
    height: "100vh",
    maxWidth: 600,
    overflow: "auto",
    padding: theme.spacing.xl,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
    margin: "0 auto",
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const jobs = [
  { value: "Architect", label: "Architect" },
  { value: "Director", label: "Director" },
  { value: "Doctor", label: "Doctor" },
  { value: "Engineer", label: "Engineer" },
  { value: "Lecturer", label: "Lecturer" },
  { value: "Manager", label: "Manager" },
  { value: "Nurse", label: "Nurse" },
  { value: "Pharmacist", label: "Pharmacist" },
  { value: "Programmer", label: "Programmer" },
  { value: "Technician", label: "Technician" },
  { value: "Other", label: "Other" },
];

// const natureOfBusiness = [
//   "Hospital Building",
//   "Hospital Mechanic",
//   "Hospital Electric",
//   "Hospital Environment",
//   "Hospital Informatics",
//   "Hospital Devices",
//   "COVID-19 Related Products",
//   "Other",
// ];
const natureOfBusiness = [
  "hospital-buildings",
  "hospital-mechanics",
  "hospital-devices",
  "hospital-electrics",
  "hospital-environments",
  "hospital-informatics",
  "covid-19",
  "other",
];

const schema = z
  .object({
    email: z.string().email().nonempty(),
    mobile: z.string().nonempty(),
    name: z.string().nonempty(),
    job_function: z.string().nonempty(),
    password: z.string().min(8).nonempty(),
    password_confirmation: z.string().nonempty(),
    company_name: z.string().nonempty(),
    company_website: z.string(),
    country: z.string().nonempty(),
    province: z.string().optional(),
    business_nature: z
      .array(z.string())
      .nonempty({ message: "choose at least 1" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password don't match",
    path: ["password_confirmation"],
  });

export default function RegisterExhibitor() {
  const router = useRouter();
  const { classes } = useStyles();
  const { isAuthenticated, isInitialized, register } = useAuth();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();
  const { t } = useTranslation("auth");
  const theme = useMantineTheme();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: "",
      mobile: "",
      name: "",
      job_function: "",
      password: "",
      password_confirmation: "",
      company_name: "",
      company_website: "",
      country: "",
      province: "",
      business_nature: [],
    },
  });

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/app");
    }
  }, [router, isInitialized, isAuthenticated]);

  const { data: packages } = usePackages();
  const listTopics =
    packages?.map((p) => ({
      label: `${p.order}. ${p.name}`,
      value: p.name,
      description: p.description,
      link: p.link,
    })) || [];

  const handleSubmit = async (values: typeof form.values) => {
    const payload: RegisterInputs = {
      ...values,
      role: "exhibitor",
      province: values.province ? values.province : "other",
    };

    setVisible(true);
    try {
      await register(payload);
      setVisible(false);
      router.replace("/app");
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message
          ? JSON.stringify(error?.message)
              .replace(/{|}|\[|\]|\"/g, "")
              .replace(":", ": ")
              .replace(",", ", ")
          : "Error",
        color: "red",
      });
    }
  };

  if (!isInitialized || isAuthenticated) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      <Container size="xl" style={{ padding: 0 }}>
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: theme.breakpoints.lg, cols: 1 }]}
        >
          <div className={classes.infoContainer}>
            <div style={{ position: "fixed", maxWidth: 500 }}>
              <div style={{ display: "flex" }}>
                <Image
                  width={42}
                  height={42}
                  style={{ flexShrink: 0 }}
                  src="/logo.png"
                  alt="Logo HEF"
                />

                <Text ml="sm" className={classes.infoTitle}>
                  Hospital Engineering Expo 2022
                </Text>
              </div>
              <Title mt={40} order={3}>
                Highlight
              </Title>
              <List
                mt={20}
                spacing="lg"
                size="lg"
                center
                icon={
                  <ThemeIcon size={36} radius="xl">
                    <CircleCheck size={28} />
                  </ThemeIcon>
                }
              >
                <List.Item style={{ lineHeight: 1.5 }}>
                  More than 40 speakers from government, association, hospital,
                  and industries
                </List.Item>
                <List.Item style={{ lineHeight: 1.5 }}>
                  More than 100 local and international exhibitors
                </List.Item>
                <List.Item style={{ lineHeight: 1.5 }}>
                  More than 10000 PTPI registered members (healthcare
                  professionals)
                </List.Item>
                <List.Item style={{ lineHeight: 1.5 }}>
                  Hospital engineering in covid-19 and industry 4.0 era
                </List.Item>
              </List>
            </div>
          </div>
          <Paper
            shadow="md"
            withBorder
            className={classes.form}
            radius={0}
            style={{ height: "100%", position: "relative" }}
          >
            <LoadingOverlay visible={visible} />
            <NextLink
              href="/"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Title order={2} className={classes.title} align="center" mb={30}>
                {t("register-as-exhibitor")}
              </Title>

              <Text weight={700} mb="xs">
                {t("account-info")}
              </Text>
              <SimpleGrid
                cols={2}
                mb="lg"
                breakpoints={[{ maxWidth: "xs", cols: 1 }]}
              >
                <TextInput
                  label={t("email")}
                  placeholder="hello@gmail.com"
                  size="sm"
                  required
                  {...form.getInputProps("email")}
                />
                <TextInput
                  label={t("mobile")}
                  placeholder="081234567890"
                  size="sm"
                  required
                  {...form.getInputProps("mobile")}
                />
                <PasswordInput
                  label={t("password")}
                  placeholder="Your password"
                  size="sm"
                  required
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  label={t("confirm-password")}
                  placeholder="Your password"
                  size="sm"
                  required
                  {...form.getInputProps("password_confirmation")}
                />
              </SimpleGrid>

              <Text weight={700} mb="xs">
                {t("personal-info")}
              </Text>

              <SimpleGrid
                cols={2}
                mb="lg"
                breakpoints={[{ maxWidth: "xs", cols: 1 }]}
              >
                <TextInput
                  label={t("name")}
                  placeholder="Dr. John Doe"
                  size="sm"
                  required
                  {...form.getInputProps("name")}
                />
                <Select
                  label={t("job-visitor.label")}
                  placeholder="Choose"
                  size="sm"
                  required
                  searchable
                  nothingFound="No options"
                  data={jobs}
                  {...form.getInputProps("job_function")}
                />
              </SimpleGrid>

              <Text weight={700} mb="xs">
                {t("company-info")}
              </Text>
              <SimpleGrid
                cols={2}
                mb="lg"
                breakpoints={[{ maxWidth: "xs", cols: 1 }]}
              >
                <TextInput
                  label={t("institution-name")}
                  placeholder="PT. ABC123"
                  size="sm"
                  required
                  {...form.getInputProps("company_name")}
                />
                <TextInput
                  label={t("company-website")}
                  placeholder="https://example.com"
                  size="sm"
                  {...form.getInputProps("company_website")}
                />
                <Select
                  label={t("country")}
                  placeholder="Choose"
                  size="sm"
                  required
                  searchable
                  nothingFound="No options"
                  data={countries}
                  {...form.getInputProps("country")}
                />
                {form.values.country === "Indonesia" && (
                  <Select
                    label={t("province")}
                    placeholder="Choose"
                    size="sm"
                    required
                    searchable
                    nothingFound="No options"
                    data={provinces}
                    {...form.getInputProps("province")}
                  />
                )}
              </SimpleGrid>

              {/* <CheckboxGroup
                label={t("business-nature")}
                required
                mb="lg"
                {...form.getInputProps("business_nature")}
              >
                {natureOfBusiness?.map((nb) => (
                  <Checkbox key={nb} value={nb} label={t(nb)} />
                ))}
              </CheckboxGroup> */}

              <CheckboxGroup
                label={t("business-nature")}
                required
                mb="md"
                orientation="vertical"
                spacing="md"
                {...form.getInputProps("business_nature")}
              >
                {listTopics?.map((topic, i) => (
                  <Checkbox key={i} value={topic.value} label={topic.label} />
                ))}
              </CheckboxGroup>

              <Button type="submit" fullWidth mt="xl" size="md">
                {t("register-as-exhibitor")}
              </Button>
            </form>

            <Divider my="xs" label="Or" labelPosition="center" />

            <SimpleGrid
              cols={2}
              mt="md"
              breakpoints={[{ maxWidth: "xs", cols: 1 }]}
            >
              <Link href="/register/visitor" passHref>
                <Button component="a" variant="outline">
                  {t("register-as-visitor")}
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button component="a" variant="outline">
                  {t("login")}
                </Button>
              </Link>
            </SimpleGrid>
          </Paper>
        </SimpleGrid>
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
