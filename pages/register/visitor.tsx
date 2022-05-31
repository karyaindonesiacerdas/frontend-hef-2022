import React, { useEffect, useState } from "react";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
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
  RadioGroup,
  Radio,
  Divider,
  Container,
  List,
  ThemeIcon,
  Image,
  LoadingOverlay,
  useMantineTheme,
} from "@mantine/core";
import { CircleCheck } from "tabler-icons-react";
import { useRouter } from "next/router";
import { NextLink } from "@mantine/next";
import { z } from "zod";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { useAuth } from "contexts/auth.context";
import { useForm, zodResolver } from "@mantine/form";
import { countries } from "data/countries";
import { provinces } from "data/provinces";
import { RegisterInputs } from "services/auth.service";
import { useNotifications } from "@mantine/notifications";

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
    minHeight: "100vh",
  },

  infoContainer: {
    padding: theme.spacing.xl * 2,
    [theme.fn.smallerThan("lg")]: {
      display: "none",
    },
  },

  infoTitle: {
    fontSize: theme.fontSizes.xl * 1.4,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor[9]],
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

// const institutionTypes = [
//   { value: "Comunity Health Services", label: "Comunity Health Services" },
//   { value: "Consultancy Services", label: "Consultancy Services" },
//   { value: "Contractor (Hospital)", label: "Contractor (Hospital)" },
//   { value: "Dealers & Distributors", label: "Dealers & Distributors" },
//   {
//     value: "Educational Institute (Medical)",
//     label: "Educational Institute (Medical)",
//   },
//   {
//     value: "Educational Institute (Non-Medical)",
//     label: "Educational Institute (Non-Medical)",
//   },
//   {
//     value: "Government (Ministry of Health)",
//     label: "Government (Ministry of Health)",
//   },
//   { value: "Hospital (Private)", label: "Hospital (Private)" },
//   { value: "Hospital (Public)", label: "Hospital (Public)" },
//   {
//     value: "Import & Export (Healthcare)",
//     label: "Import & Export (Healthcare)",
//   },
//   {
//     value: "Information Technology/ Software (Healthcare)",
//     label: "Information Technology/ Software (Healthcare)",
//   },
//   { value: "Investor (Healthcare)", label: "Investor (Healthcare)" },
//   { value: "Laboratories (Medical)", label: "Laboratories (Medical)" },
//   { value: "Laboratory", label: "Laboratory" },
//   { value: "Manufacturer (Medical)", label: "Manufacturer (Medical)" },
//   { value: "Medical Practice", label: "Medical Practice" },
//   { value: "Medical Travel", label: "Medical Travel" },
//   { value: "Technology (Medical)", label: "Technology (Medical)" },
//   { value: "Other", label: "Other" },
// ];

// const jobs = [
//   { value: "Architect", label: "Architect" },
//   { value: "Director", label: "Director" },
//   { value: "Doctor", label: "Doctor" },
//   { value: "Engineer", label: "Engineer" },
//   { value: "Lecturer", label: "Lecturer" },
//   { value: "Manager", label: "Manager" },
//   { value: "Nurse", label: "Nurse" },
//   { value: "Pharmacist", label: "Pharmacist" },
//   { value: "Programmer", label: "Programmer" },
//   { value: "Technician", label: "Technician" },
//   { value: "Other", label: "Other" },
// ];

// const productInterests = [
//   "hospital-buildings",
//   "hospital-mechanics",
//   "hospital-electrics",
//   "hospital-environments",
//   "hospital-informatics",
//   "hospital-devices",
//   "covid-19",
//   "other",
// ];

// const purposeVisitings = [
//   "buying",
//   "networking",
//   "information-gathering",
//   "join-webinar",
//   "consultation",
//   "other",
// ];

// const visitorTypes = [
//   { value: "Hospital Management Staff", label: "Hospital Management Staff" },
//   { value: "Hospital Clinical Staff", label: "Hospital Clinical Staff" },
//   { value: "Hospital Engineering Staff", label: "Hospital Engineering Staff" },
//   { value: "Biomedical Engineering", label: "Biomedical Engineering" },
//   {
//     value: "Medical Doctor",
//     label: "Medical Doctor",
//   },
//   {
//     value: "Government Staff",
//     label: "Government Staff",
//   },
//   {
//     value: "University Lecturer",
//     label: "University Lecturer",
//   },
// ];

const schema = z
  .object({
    email: z.string().email().nonempty(),
    // country: z.string().nonempty(),
    // institution_name: z.string().nonempty(),
    // institution_type: z.string().nonempty(),
    // job_function: z.string().nonempty(),
    // member_sehat_ri: z.string().nonempty({ message: "Choose" }),
    mobile: z.string().nonempty(),
    name: z.string().nonempty(),
    password: z.string().min(5).nonempty(),
    password_confirmation: z.string().nonempty(),
    // product_interest: z
    //   .array(z.string())
    //   .nonempty({ message: "choose at least 1" }),
    // visit_purpose: z
    //   .array(z.string())
    //   .nonempty({ message: "choose at least 1" }),
    // province: z.string(),
    // visitor_type: z.string(),
    // allow_share_info: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password don't match",
    path: ["password_confirmation"],
  });

export default function RegisterVisitor() {
  const { classes } = useStyles();
  const router = useRouter();
  const { isAuthenticated, isInitialized, register } = useAuth();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();
  const { t } = useTranslation("auth");
  const theme = useMantineTheme();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      email: "",
      // country: "",
      // institution_name: "",
      // institution_type: "",
      // job_function: "",
      // member_sehat_ri: "",
      mobile: "",
      name: "",
      password: "",
      password_confirmation: "",
      // product_interest: [],
      // province: "",
      // visit_purpose: [],
      // visitor_type: "",
      // allow_share_info: "",
    },
  });

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace("/app");
    }
  }, [router, isInitialized, isAuthenticated]);

  const handleSubmit = async (values: typeof form.values) => {
    const payload: RegisterInputs = {
      ...values,
      role: "visitor",
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
                  More than 40 speakers from goverment, association, hospital,
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
            p={30}
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
                {t("register-as-visitor")}
              </Title>

              <Text weight={700} mb="xs">
                {t("account-info")}
              </Text>
              <SimpleGrid cols={2} mb="lg">
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
                <TextInput
                  label={t("name")}
                  placeholder="Dr. John Doe"
                  size="sm"
                  required
                  {...form.getInputProps("name")}
                />
                <div />
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
              <Button type="submit" fullWidth mt="xl" size="md">
                {t("register-as-visitor")}
              </Button>
            </form>

            <Divider my="xs" label="Or" labelPosition="center" />

            <SimpleGrid cols={2} mt="md">
              <Link href="/register/exhibitor" passHref>
                <Button component="a" variant="outline">
                  {t("register-as-exhibitor")}
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

// import React, { useEffect, useState } from "react";
// import { GetStaticPropsContext } from "next";
// import Link from "next/link";
// import {
//   Paper,
//   createStyles,
//   TextInput,
//   PasswordInput,
//   Checkbox,
//   Button,
//   Title,
//   Text,
//   Select,
//   CheckboxGroup,
//   SimpleGrid,
//   RadioGroup,
//   Radio,
//   Divider,
//   Container,
//   List,
//   ThemeIcon,
//   Image,
//   LoadingOverlay,
//   useMantineTheme,
// } from "@mantine/core";
// import { CircleCheck } from "tabler-icons-react";
// import { useRouter } from "next/router";
// import { NextLink } from "@mantine/next";
// import { z } from "zod";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { useTranslation } from "next-i18next";

// import { useAuth } from "contexts/auth.context";
// import { useForm, zodResolver } from "@mantine/form";
// import { countries } from "data/countries";
// import { provinces } from "data/provinces";
// import { RegisterInputs } from "services/auth.service";
// import { useNotifications } from "@mantine/notifications";

// const useStyles = createStyles((theme) => ({
//   // wrapper: {
//   //   minHeight: "100vh",
//   //   backgroundSize: "cover",
//   //   backgroundImage:
//   //     "url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80)",
//   //   display: "flex",
//   //   justifyContent: "flex-end",
//   // },
//   wrapper: {
//     // display: "flex",
//     // justifyContent: "center",
//     padding: theme.spacing.xl,
//     backgroundImage: `linear-gradient(to bottom right, ${
//       theme.colors[theme.primaryColor][6]
//     },${theme.colors[theme.primaryColor][3]})`,
//     [theme.fn.smallerThan("sm")]: {
//       padding: theme.spacing.sm,
//     },
//   },

//   infoContainer: {
//     padding: theme.spacing.xl * 2,
//     [theme.fn.smallerThan("lg")]: {
//       display: "none",
//     },
//   },

//   infoTitle: {
//     fontSize: theme.fontSizes.xl * 1.4,
//     fontWeight: 700,
//     color: theme.colors[theme.primaryColor[9]],
//   },

//   logoTitle: {
//     fontSize: theme.fontSizes.xl,
//     fontWeight: 700,
//     color: theme.colors[theme.primaryColor][6],
//   },

//   form: {
//     borderRadius: theme.radius.lg,
//     // borderLeft: `1px solid ${
//     //   theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
//     // }`,
//     height: "100vh",
//     maxWidth: 600,
//     overflow: "auto",
//     padding: theme.spacing.xl,
//     [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
//       maxWidth: "100%",
//     },
//     margin: "0 auto",
//   },

//   title: {
//     color: theme.colorScheme === "dark" ? theme.white : theme.black,
//     fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//   },

//   logo: {
//     color: theme.colorScheme === "dark" ? theme.white : theme.black,
//     width: 120,
//     display: "block",
//     marginLeft: "auto",
//     marginRight: "auto",
//   },
// }));

// const institutionTypes = [
//   { value: "Comunity Health Services", label: "Comunity Health Services" },
//   { value: "Consultancy Services", label: "Consultancy Services" },
//   { value: "Contractor (Hospital)", label: "Contractor (Hospital)" },
//   { value: "Dealers & Distributors", label: "Dealers & Distributors" },
//   {
//     value: "Educational Institute (Medical)",
//     label: "Educational Institute (Medical)",
//   },
//   {
//     value: "Educational Institute (Non-Medical)",
//     label: "Educational Institute (Non-Medical)",
//   },
//   {
//     value: "Government (Ministry of Health)",
//     label: "Government (Ministry of Health)",
//   },
//   { value: "Hospital (Private)", label: "Hospital (Private)" },
//   { value: "Hospital (Public)", label: "Hospital (Public)" },
//   {
//     value: "Import & Export (Healthcare)",
//     label: "Import & Export (Healthcare)",
//   },
//   {
//     value: "Information Technology/ Software (Healthcare)",
//     label: "Information Technology/ Software (Healthcare)",
//   },
//   { value: "Investor (Healthcare)", label: "Investor (Healthcare)" },
//   { value: "Laboratories (Medical)", label: "Laboratories (Medical)" },
//   { value: "Laboratory", label: "Laboratory" },
//   { value: "Manufacturer (Medical)", label: "Manufacturer (Medical)" },
//   { value: "Medical Practice", label: "Medical Practice" },
//   { value: "Medical Travel", label: "Medical Travel" },
//   { value: "Technology (Medical)", label: "Technology (Medical)" },
//   { value: "Other", label: "Other" },
// ];

// const jobs = [
//   { value: "Architect", label: "Architect" },
//   { value: "Director", label: "Director" },
//   { value: "Doctor", label: "Doctor" },
//   { value: "Engineer", label: "Engineer" },
//   { value: "Lecturer", label: "Lecturer" },
//   { value: "Manager", label: "Manager" },
//   { value: "Nurse", label: "Nurse" },
//   { value: "Pharmacist", label: "Pharmacist" },
//   { value: "Programmer", label: "Programmer" },
//   { value: "Technician", label: "Technician" },
//   { value: "Other", label: "Other" },
// ];

// const productInterests = [
//   "hospital-buildings",
//   "hospital-mechanics",
//   "hospital-electrics",
//   "hospital-environments",
//   "hospital-informatics",
//   "hospital-devices",
//   "covid-19",
//   "other",
// ];

// const purposeVisitings = [
//   "buying",
//   "networking",
//   "information-gathering",
//   "join-webinar",
//   "consultation",
//   "other",
// ];

// const visitorTypes = [
//   { value: "Hospital Management Staff", label: "Hospital Management Staff" },
//   { value: "Hospital Clinical Staff", label: "Hospital Clinical Staff" },
//   { value: "Hospital Engineering Staff", label: "Hospital Engineering Staff" },
//   { value: "Biomedical Engineering", label: "Biomedical Engineering" },
//   {
//     value: "Medical Doctor",
//     label: "Medical Doctor",
//   },
//   {
//     value: "Government Staff",
//     label: "Government Staff",
//   },
//   {
//     value: "University Lecturer",
//     label: "University Lecturer",
//   },
// ];

// const schema = z
//   .object({
//     email: z.string().email().nonempty(),
//     country: z.string().nonempty(),
//     institution_name: z.string().nonempty(),
//     institution_type: z.string().nonempty(),
//     job_function: z.string().nonempty(),
//     member_sehat_ri: z.string().nonempty({ message: "Choose" }),
//     mobile: z.string().nonempty(),
//     name: z.string().nonempty(),
//     password: z.string().min(8).nonempty(),
//     password_confirmation: z.string().nonempty(),
//     product_interest: z
//       .array(z.string())
//       .nonempty({ message: "choose at least 1" }),
//     visit_purpose: z
//       .array(z.string())
//       .nonempty({ message: "choose at least 1" }),
//     province: z.string(),
//     visitor_type: z.string(),
//     allow_share_info: z.string(),
//   })
//   .refine((data) => data.password === data.password_confirmation, {
//     message: "Password don't match",
//     path: ["password_confirmation"],
//   });

// export default function RegisterVisitor() {
//   const { classes } = useStyles();
//   const router = useRouter();
//   const { isAuthenticated, isInitialized, register } = useAuth();
//   const [visible, setVisible] = useState(false);
//   const notifications = useNotifications();
//   const { t } = useTranslation("auth");
//   const theme = useMantineTheme();

//   const form = useForm({
//     schema: zodResolver(schema),
//     initialValues: {
//       email: "",
//       country: "",
//       institution_name: "",
//       institution_type: "",
//       job_function: "",
//       member_sehat_ri: "",
//       mobile: "",
//       name: "",
//       password: "",
//       password_confirmation: "",
//       product_interest: [],
//       province: "",
//       visit_purpose: [],
//       visitor_type: "",
//       allow_share_info: "",
//     },
//   });

//   useEffect(() => {
//     if (isInitialized && isAuthenticated) {
//       router.replace("/app");
//     }
//   }, [router, isInitialized, isAuthenticated]);

//   const handleSubmit = async (values: typeof form.values) => {
//     const payload: RegisterInputs = {
//       ...values,
//       allow_share_info: values.allow_share_info === "Yes" ? true : false,
//       role: "visitor",
//     };

//     setVisible(true);
//     try {
//       await register(payload);
//       setVisible(false);
//       router.replace("/app");
//     } catch (error: any) {
//       setVisible(false);
//       notifications.showNotification({
//         title: "Error",
//         message: error?.message
//           ? JSON.stringify(error?.message)
//               .replace(/{|}|\[|\]|\"/g, "")
//               .replace(":", ": ")
//               .replace(",", ", ")
//           : "Error",
//         color: "red",
//       });
//     }
//   };

//   if (!isInitialized || isAuthenticated) {
//     return null;
//   }

//   return (
//     <div className={classes.wrapper}>
//       <Container size="xl" style={{ padding: 0 }}>
//         <SimpleGrid
//           cols={2}
//           breakpoints={[{ maxWidth: theme.breakpoints.lg, cols: 1 }]}
//         >
//           <div className={classes.infoContainer}>
//             <div style={{ position: "fixed", maxWidth: 500 }}>
//               <div style={{ display: "flex" }}>
//                 <Image
//                   width={42}
//                   height={42}
//                   style={{ flexShrink: 0 }}
//                   src="/logo.png"
//                   alt="Logo HEF"
//                 />

//                 <Text ml="sm" className={classes.infoTitle}>
//                   Hospital Engineering Expo 2022
//                 </Text>
//               </div>
//               <Title mt={40} order={3}>
//                 Highlight
//               </Title>
//               <List
//                 mt={20}
//                 spacing="lg"
//                 size="lg"
//                 center
//                 icon={
//                   <ThemeIcon size={36} radius="xl">
//                     <CircleCheck size={28} />
//                   </ThemeIcon>
//                 }
//               >
//                 <List.Item style={{ lineHeight: 1.5 }}>
//                   More than 40 speakers from goverment, association, hospital,
//                   and industries
//                 </List.Item>
//                 <List.Item style={{ lineHeight: 1.5 }}>
//                   More than 100 local and international exhibitors
//                 </List.Item>
//                 <List.Item style={{ lineHeight: 1.5 }}>
//                   More than 10000 PTPI registered members (healthcare
//                   professionals)
//                 </List.Item>
//                 <List.Item style={{ lineHeight: 1.5 }}>
//                   Hospital engineering in covid-19 and industry 4.0 era
//                 </List.Item>
//               </List>
//             </div>
//           </div>
//           <Paper
//             shadow="md"
//             withBorder
//             className={classes.form}
//             radius={0}
//             p={30}
//             style={{ height: "100%", position: "relative" }}
//           >
//             <LoadingOverlay visible={visible} />
//             <NextLink
//               href="/"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 textDecoration: "none",
//               }}
//             >
//               <Image
//                 width={42}
//                 height={42}
//                 style={{ flexShrink: 0 }}
//                 src="/logo.png"
//                 alt="Logo HEF"
//               />
//               <Text className={classes.logoTitle}>HEF 2022</Text>
//             </NextLink>
//             <form onSubmit={form.onSubmit(handleSubmit)}>
//               <Title order={2} className={classes.title} align="center" mb={30}>
//                 {t("register-as-visitor")}
//               </Title>

//               <Text weight={700} mb="xs">
//                 {t("account-info")}
//               </Text>
//               <SimpleGrid cols={2} mb="lg">
//                 <TextInput
//                   label={t("email")}
//                   placeholder="hello@gmail.com"
//                   size="sm"
//                   required
//                   {...form.getInputProps("email")}
//                 />
//                 <TextInput
//                   label={t("mobile")}
//                   placeholder="081234567890"
//                   size="sm"
//                   required
//                   {...form.getInputProps("mobile")}
//                 />
//                 <PasswordInput
//                   label={t("password")}
//                   placeholder="Your password"
//                   size="sm"
//                   required
//                   {...form.getInputProps("password")}
//                 />
//                 <PasswordInput
//                   label={t("confirm-password")}
//                   placeholder="Your password"
//                   size="sm"
//                   required
//                   {...form.getInputProps("password_confirmation")}
//                 />
//               </SimpleGrid>

//               <Text weight={700} mb="xs">
//                 {t("personal-info")}
//               </Text>
//               <SimpleGrid cols={2} mb="lg">
//                 <TextInput
//                   label={t("name")}
//                   placeholder="Dr. John Doe"
//                   size="sm"
//                   required
//                   {...form.getInputProps("name")}
//                 />
//                 <Select
//                   label={t("job-visitor.label")}
//                   placeholder="Choose"
//                   size="sm"
//                   required
//                   searchable
//                   nothingFound="No options"
//                   data={jobs}
//                   clearable
//                   {...form.getInputProps("job_function")}
//                 />
//                 <TextInput
//                   label={t("insitution-name")}
//                   placeholder="Rumah Sakit A"
//                   size="sm"
//                   required
//                   {...form.getInputProps("institution_name")}
//                 />
//                 <Select
//                   label={t("institution-type.label")}
//                   placeholder="Choose"
//                   size="sm"
//                   required
//                   searchable
//                   nothingFound="No options"
//                   data={institutionTypes}
//                   {...form.getInputProps("institution_type")}
//                 />
//                 <Select
//                   label={t("country")}
//                   placeholder="Choose"
//                   size="sm"
//                   required
//                   searchable
//                   nothingFound="No options"
//                   data={countries}
//                   {...form.getInputProps("country")}
//                 />
//                 {form.values.country === "Indonesia" && (
//                   <Select
//                     label={t("province")}
//                     placeholder="Choose"
//                     size="sm"
//                     required
//                     searchable
//                     nothingFound="No options"
//                     data={provinces}
//                     {...form.getInputProps("province")}
//                   />
//                 )}
//                 <Select
//                   label={t("visitor-type.label")}
//                   placeholder="Choose"
//                   size="sm"
//                   required
//                   searchable
//                   nothingFound="No options"
//                   data={visitorTypes}
//                   {...form.getInputProps("visitor_type")}
//                 />
//               </SimpleGrid>

//               <CheckboxGroup
//                 label={t("product-interest")}
//                 required
//                 mb="lg"
//                 {...form.getInputProps("product_interest")}
//               >
//                 {productInterests?.map((productInterest) => (
//                   <Checkbox
//                     key={productInterest}
//                     value={productInterest}
//                     label={t(productInterest)}
//                   />
//                 ))}
//               </CheckboxGroup>

//               <CheckboxGroup
//                 label={t("purpose-visit.label")}
//                 required
//                 mb="lg"
//                 {...form.getInputProps("visit_purpose")}
//               >
//                 {purposeVisitings?.map((purposeVisiting) => (
//                   <Checkbox
//                     key={purposeVisiting}
//                     value={purposeVisiting}
//                     label={t(`purpose-visit.${purposeVisiting}`)}
//                   />
//                 ))}
//               </CheckboxGroup>

//               <RadioGroup
//                 label={t("sehat-ri.label")}
//                 required
//                 size="sm"
//                 mb="lg"
//                 {...form.getInputProps("member_sehat_ri")}
//               >
//                 <Radio value="Yes" label={t("sehat-ri.yes")} />
//                 <Radio value="No" label={t("sehat-ri.no")} />
//                 <Radio value="I Forget" label={t("sehat-ri.forget")} />
//               </RadioGroup>

//               <CheckboxGroup label={t("sehat-ri.term")} required mb="lg">
//                 <Checkbox
//                   value="I understand and accept the condition"
//                   label={t("sehat-ri.accept")}
//                 />
//               </CheckboxGroup>

//               <RadioGroup
//                 label={t("share-info")}
//                 required
//                 size="sm"
//                 mb="lg"
//                 {...form.getInputProps("allow_share_info")}
//               >
//                 <Radio value="Yes" label={t("sehat-ri.yes")} />
//                 <Radio value="No" label={t("sehat-ri.no")} />
//               </RadioGroup>

//               <Button type="submit" fullWidth mt="xl" size="md">
//                 {t("register-as-visitor")}
//               </Button>
//             </form>

//             <Divider my="xs" label="Or" labelPosition="center" />

//             <SimpleGrid cols={2} mt="md">
//               <Link href="/register/exhibitor" passHref>
//                 <Button component="a" variant="outline">
//                   {t("register-as-exhibitor")}
//                 </Button>
//               </Link>
//               <Link href="/login" passHref>
//                 <Button component="a" variant="outline">
//                   {t("login")}
//                 </Button>
//               </Link>
//             </SimpleGrid>
//           </Paper>
//         </SimpleGrid>
//       </Container>
//     </div>
//   );
// }

// export const getStaticProps = async ({
//   locale = "en",
// }: GetStaticPropsContext) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ["common", "auth"])),
//   },
// });
