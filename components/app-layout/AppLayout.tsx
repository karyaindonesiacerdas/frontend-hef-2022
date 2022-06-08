import React, { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Center,
  Tooltip,
  UnstyledButton,
  createStyles,
  Group,
  Box,
  Menu,
  Avatar,
  Text,
  Modal,
  SimpleGrid,
  TextInput,
  Select,
  InputWrapper,
  CheckboxGroup,
  Checkbox,
  NativeSelect,
  Button,
  ActionIcon,
  Divider,
  Title,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import {
  Icon as TablerIcon,
  Home2,
  DeviceDesktopAnalytics,
  User,
  Microphone2,
  Dashboard,
  At,
  Phone,
  Trash,
  CircleCheck,
} from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import { useAuth } from "contexts/auth.context";
import { useMe } from "services/user/hooks";
import { getFileUrl } from "utils/file-storage";
import MyBooth from "icons/MyBooth";
import { useLocalStorage, useOs } from "@mantine/hooks";
import { ContactIconsList } from "../home/ContactIcons";
import { useExhibitor } from "services/exhibitor/hooks";
import { useNotifications } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import { useForm, zodResolver } from "@mantine/form";
import { updateProfile, UpdateProfilePayload } from "services/auth.service";
import { usePackages } from "services/package/hooks/usePackages";
import { usePositions } from "services/position/hooks/usePositions";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { trimString } from "utils/string";
import { useAppModal } from "contexts/modal.context";
import { countries } from "data/countries";
import { provinces } from "data/provinces";

const useStyles = createStyles((theme) => ({
  link: {
    marginTop: 10,
    width: 45,
    height: 45,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
    },
  },

  navbar: {
    position: "fixed",
    left: 10,
    background: "rgba( 255, 255, 255, 0.5 )",
    // boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
  },

  user: {
    display: "block",
    paddingBottom: theme.spacing.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    // "&:hover": {
    //   backgroundColor:
    //     theme.colorScheme === "dark"
    //       ? theme.colors.dark[8]
    //       : theme.colors.gray[0],
    // },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  link: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  link,
}: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" withArrow transitionDuration={0}>
      <NextLink
        style={{ textDecoration: "none" }}
        href={link}
        // onClick={onClick}
        className={cx(classes.link, { [classes.active]: active })}
      >
        <Icon />
      </NextLink>
    </Tooltip>
  );
}

const mockdata = [
  { icon: Home2, label: "Main Hall", link: "/app/main-hall" },
  { icon: Microphone2, label: "Seminar", link: "/app/seminar" },
  {
    icon: DeviceDesktopAnalytics,
    label: "Exhibitor",
    link: "/app/enter-exhibitor",
  },
  // {
  //   icon: CalendarStats,
  //   label: "Webinar Schedule",
  //   link: "/app/webinar-schedule",
  // },
  { icon: User, label: "Account", link: "/app/my-account" },
  // { icon: Settings, label: "Settings", link: "/app/settings" },
];

const CONTACT = [
  {
    title: "Email",
    description: "hospital.engineering.expo@gmail.com",
    icon: At,
    locale: "email",
  },
  {
    title: "Phone 1",
    locale: "phone-1",
    description: "+62 858 9377 7283 (Adrian)",
    icon: Phone,
  },
  {
    title: "Phone 2",
    locale: "phone-2",
    description: "+62 877 7889 9087 (Jordy)",
    icon: Phone,
  },
];

export default function AppLayout() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(2);
  const { pathname } = useRouter();
  const { logout, user, isInitialized } = useAuth();
  const { data: me } = useMe();
  const [openInfo, setOpenInfo] = useLocalStorage({
    key: "open",
    defaultValue: "true",
  });
  const { data: exhibitor } = useExhibitor(user?.id ? String(user?.id) : "");
  const [value, setValue] = useLocalStorage({
    key: "skip-enter",
    defaultValue: false,
  });
  const [openUpdateProfile, setOpenUpdateProfile] = useLocalStorage({
    key: "open-update-profile",
    defaultValue: "true",
  });
  const [firstLogin, setFirstLogin] = useLocalStorage({
    key: "first-login",
    defaultValue: "true",
  });

  const dataLinks = mockdata.map((link) => {
    if (value === true && link.label === "Exhibitor") {
      return {
        ...link,
        link: "/app/exhibitor",
      };
    } else {
      return link;
    }
  });

  const links = dataLinks?.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      // active={pathname === link.link}
      active={
        link.link === "/app/enter-exhibitor"
          ? pathname.includes("exhibitor")
            ? true
            : false
          : pathname.includes(link.link)
      }
      onClick={() => setActive(index)}
    />
  ));

  return (
    <>
      {user?.role === "exhibitor" && (
        <Modal
          centered
          opened={openInfo === "true"}
          onClose={() => setOpenInfo("close")}
          title={
            <Text size="xl" weight={600}>
              Selamat Datang
            </Text>
          }
        >
          <Text mb="lg">
            Anda terdaftar sebagai exhibitor. Hubungi kontak dibawah ini untuk
            pilih paket dan info lebih lanjut. Terima kasih
          </Text>
          <ContactIconsList data={CONTACT} />
        </Modal>
      )}
      {/* {isInitialized &&
        user?.role === "visitor" &&
        (!user?.email ||
          !user?.mobile ||
          !user.name ||
          openUpdateProfile === "true") && <UpdateProfileModal />} */}
      {/* {isInitialized && user?.role === "visitor" && <UpdateProfileModal />} */}
      <Navbar
        height={"95vh"}
        className={classes.navbar}
        width={{ base: 70 }}
        p="sm"
      >
        <Center>
          <Box
            component="img"
            width={32}
            height={32}
            style={{ flexShrink: 0 }}
            src="/logo.png"
            alt="Logo HEF"
          />
        </Center>
        <Navbar.Section grow mt={50}>
          <Group direction="column" align="center" spacing={0}>
            {links}
            {user?.role === "exhibitor" && exhibitor?.package_id && (
              <Tooltip
                label="My Booth"
                position="right"
                withArrow
                transitionDuration={0}
              >
                <NextLink
                  style={{ textDecoration: "none" }}
                  href={`/app/exhibitor/${user?.id}`}
                  // onClick={onClick}
                  className={cx(classes.link, {
                    [classes.active]: pathname === `/app/exhibitor/${user?.id}`,
                  })}
                >
                  <MyBooth />
                </NextLink>
              </Tooltip>
            )}
          </Group>
        </Navbar.Section>
        <Navbar.Section>
          {user?.role === "admin" && (
            <NavbarLink
              icon={Dashboard}
              label="Admin Dashboard"
              link="/admin"
            />
          )}
          <Menu
            mt="md"
            style={{ display: "block", width: "100%" }}
            control={
              <UnstyledButton className={classes.user}>
                <Avatar
                  src={getFileUrl(me?.img_profile, "profiles")}
                  radius="xl"
                  size="md"
                  ml={4}
                />
              </UnstyledButton>
            }
            withArrow
            position="right"
          >
            <Menu.Item onClick={logout}>Logout</Menu.Item>
          </Menu>
        </Navbar.Section>
      </Navbar>
    </>
  );
}

//Update Profile Modal
const useStyles2 = createStyles((theme) => ({
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,
  },
  inputFileWrapper: {},
  inputFile: {
    opacity: 0,
    width: "0.1px",
    height: "0.1px",
    position: "absolute",
  },
  inputLabel: {
    position: "relative",
    borderRadius: theme.radius.sm,
    background: theme.colors["gray"][1],
    color: theme.colors["gray"][7],
    border: `1px solid ${theme.colors.gray[3]}`,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform .2s ease-out",
    fontSize: theme.fontSizes.sm,
    paddingTop: theme.spacing.xs * 0.8,
    paddingBottom: theme.spacing.xs * 0.8,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,

    "&:hover": {
      background: theme.colors["gray"][2],
    },
  },
}));

export const institutionTypes = [
  { value: "Comunity Health Services", label: "Comunity Health Services" },
  { value: "Consultancy Services", label: "Consultancy Services" },
  { value: "Contractor (Hospital)", label: "Contractor (Hospital)" },
  { value: "Dealers & Distributors", label: "Dealers & Distributors" },
  {
    value: "Educational Institute (Medical)",
    label: "Educational Institute (Medical)",
  },
  {
    value: "Educational Institute (Non-Medical)",
    label: "Educational Institute (Non-Medical)",
  },
  {
    value: "Government (Ministry of Health)",
    label: "Government (Ministry of Health)",
  },
  { value: "Hospital (Private)", label: "Hospital (Private)" },
  { value: "Hospital (Public)", label: "Hospital (Public)" },
  {
    value: "Import & Export (Healthcare)",
    label: "Import & Export (Healthcare)",
  },
  {
    value: "Information Technology/ Software (Healthcare)",
    label: "Information Technology/ Software (Healthcare)",
  },
  { value: "Investor (Healthcare)", label: "Investor (Healthcare)" },
  { value: "Laboratories (Medical)", label: "Laboratories (Medical)" },
  { value: "Laboratory", label: "Laboratory" },
  { value: "Manufacturer (Medical)", label: "Manufacturer (Medical)" },
  { value: "Medical Practice", label: "Medical Practice" },
  { value: "Medical Travel", label: "Medical Travel" },
  { value: "Technology (Medical)", label: "Technology (Medical)" },
  { value: "Other", label: "Other" },
];

const schema = z.object({
  name: z.string().nonempty(),
  mobile: z.string().nonempty(),
  email: z.preprocess(trimString, z.string().email()),
  position_id: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  institution_name: z.string().optional(),
  institution_type: z.string().optional(),
});

export const UpdateProfileModal = () => {
  const router = useRouter();
  const { classes } = useStyles2();
  const { data } = useMe();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const [imgProfile, setImgProfile] = useState<any>();
  const [packageId, setPackageId] = useState<string[]>([]);
  const os = useOs();
  // const [openUpdateProfile, setOpenUpdateProfile] = useLocalStorage({
  //   key: "open-update-profile",
  //   defaultValue: "true",
  // });
  // const [firstLogin, setFirstLogin] = useLocalStorage({
  //   key: "first-login",
  //   defaultValue: "true",
  // });
  const { t } = useTranslation("auth");
  const [showSuccess, setShowSuccess] = useState(true);
  const { openModal, setOpenModal } = useAppModal();

  const previewURL = imgProfile ? URL.createObjectURL(imgProfile) : "";

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      position_id: "",
      country: "",
      province: "",
      institution_name: "",
      institution_type: "",
    },
  });
  const { setValues } = form;

  const { data: packages } = usePackages();
  const listTopics =
    packages?.map((p) => ({
      label: `${p.order}. ${p.name}`,
      value: String(p.id),
    })) || [];
  const { data: positions } = usePositions();
  const listProfessions =
    positions?.map((p) => ({
      label: p.name,
      value: String(p.id),
    })) || [];

  useEffect(() => {
    if (data) {
      setValues({
        email: data?.email || "",
        name: data?.name || "",
        mobile: data?.mobile || "",
        position_id: String(data?.position_id) || "",
        province: data?.province || "",
        country: data?.country || "",
        institution_name: data?.institution_name || "",
        institution_type: data?.institution_type || "",
      });
    }
    if (typeof data?.package_id === "string") {
      setPackageId(JSON.parse(data?.package_id)?.map((p: any) => String(p)));
    } else {
      data?.package_id &&
        setPackageId(data?.package_id?.map((p: any) => String(p)));
    }
  }, [data, setValues]);

  const reset = () => {
    if (imgRef.current?.value) {
      imgRef.current.value = "";
    }
    setImgProfile(undefined);
  };

  const handleSubmit = async (values: typeof form.values) => {
    const data: UpdateProfilePayload = {
      email: values.email?.trim(),
      name: values.name,
      mobile: values.mobile,
      img_profile: imgProfile || undefined,
      position_id: Number(values.position_id),
      package_id: packageId?.map((p) => +p),
      country: values.country,
      province: values.province,
      institution_name: values.institution_name,
      institution_type: values.institution_type,
    };

    setVisible(true);
    try {
      await updateProfile(data);
      if (user?.role === "exhibitor") {
        await queryClient.invalidateQueries(["exhibitor", user?.id]);
      }
      await queryClient.invalidateQueries("me");
      setVisible(false);
      setImgProfile(undefined);
      notifications.showNotification({
        title: "Success",
        message: "Personal information changed successfully",
        color: "green",
      });
      setOpenModal(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error change personal information",
        color: "red",
      });
    }
  };

  const showUpdateForm =
    !user?.email ||
    !user.name ||
    !user.mobile ||
    !user.country ||
    !user.position_id ||
    !user.package_id ||
    !user.institution_name ||
    !user.institution_type;
  console.log({ openModal });
  console.log({ user });

  return (
    <>
      <Modal
        centered
        closeOnClickOutside={false}
        opened={openModal && showUpdateForm}
        onClose={() => {
          setOpenModal(false);
        }}
        size="lg"
        title={
          <Title sx={(theme) => ({ fontSize: theme.fontSizes.lg })}>Info</Title>
        }
      >
        {showSuccess && (
          <Alert
            title={router.locale === "en" ? "Welcome!" : "Selamat Datang!"}
            color="teal"
            withCloseButton
            onClose={() => setShowSuccess(false)}
          >
            {router.locale === "en"
              ? "Zoom link will be sent to your whatsapp number"
              : "Link zoom akan dikirim ke nomor whatsapp anda"}
          </Alert>
        )}
        {/* {showUpdateForm && ( */}
        <Box
          mt="md"
          component="form"
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ position: "relative" }}
        >
          <LoadingOverlay visible={visible} />
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <TextInput
              placeholder="Email"
              label="Email"
              required
              {...form.getInputProps("email")}
            />
            <TextInput
              placeholder="Mobile (Whatsapp)"
              label="Mobile (Whatsapp)"
              required
              {...form.getInputProps("mobile")}
            />
            <TextInput
              placeholder="Full Name"
              label="Full Name (used in the certificate)"
              required
              {...form.getInputProps("name")}
            />
            {os === "ios" ? (
              <NativeSelect
                placeholder="Choose"
                size="sm"
                required
                label="Professions"
                data={listProfessions}
                {...form.getInputProps("position_id")}
              />
            ) : (
              <Select
                placeholder="Choose"
                size="sm"
                label="Professions"
                data={listProfessions}
                {...form.getInputProps("position_id")}
              />
            )}
            <TextInput
              label="Institution Name"
              placeholder="Rumah Sakit A"
              size="sm"
              {...form.getInputProps("institution_name")}
            />

            {os === "ios" ? (
              <NativeSelect
                label="Institution Type"
                placeholder="Choose"
                size="sm"
                data={institutionTypes}
                {...form.getInputProps("institution_type")}
              />
            ) : (
              <Select
                label="Institution Type"
                placeholder="Choose"
                size="sm"
                searchable
                nothingFound="No options"
                data={institutionTypes}
                {...form.getInputProps("institution_type")}
              />
            )}
            {os === "ios" ? (
              <NativeSelect
                label="Country"
                placeholder="Choose"
                size="sm"
                data={countries}
                {...form.getInputProps("country")}
              />
            ) : (
              <Select
                label="Country"
                placeholder="Choose"
                size="sm"
                searchable
                nothingFound="No options"
                data={countries}
                {...form.getInputProps("country")}
              />
            )}

            {form.values.country === "Indonesia" ? (
              os === "ios" ? (
                <NativeSelect
                  label="Province"
                  placeholder="Choose"
                  size="sm"
                  data={provinces}
                  {...form.getInputProps("province")}
                />
              ) : (
                <Select
                  label="Province"
                  placeholder="Choose"
                  size="sm"
                  searchable
                  nothingFound="No options"
                  data={provinces}
                  {...form.getInputProps("province")}
                />
              )
            ) : (
              <div />
            )}
            <InputWrapper label="Photo">
              <Group>
                <Avatar
                  src={
                    previewURL
                      ? previewURL
                      : data?.img_profile
                      ? getFileUrl(data.img_profile, "profiles")
                      : undefined
                  }
                  size="lg"
                  radius="xl"
                />
                {previewURL ? (
                  <ActionIcon onClick={reset}>
                    <Trash color="red" />
                  </ActionIcon>
                ) : null}
                <Box mt={4} className={classes.inputFileWrapper}>
                  <label htmlFor="file" className={classes.inputLabel}>
                    Select File
                  </label>
                  <input
                    id="file"
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    className={classes.inputFile}
                    ref={imgRef}
                    onChange={(e) => {
                      if (e.target.files) {
                        setImgProfile(e.target.files[0]);
                      }
                    }}
                  />
                </Box>
              </Group>
            </InputWrapper>
          </SimpleGrid>
          <CheckboxGroup
            mt="md"
            label="Select Topics"
            mb="md"
            value={packageId}
            onChange={setPackageId}
            orientation="vertical"
            spacing="md"
          >
            {listTopics?.map((topic, i) => (
              <Checkbox
                key={i}
                value={topic.value}
                label={topic.label}
                checked={packageId?.includes(topic.value)}
              />
            ))}
          </CheckboxGroup>
          <Group mt="xs" position="right"></Group>
          <Button mt="lg" type="submit" fullWidth>
            Save
          </Button>
          <Divider my="md" label="Or" labelPosition="center" />
          <Button
            fullWidth
            variant="subtle"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Skip
          </Button>
        </Box>
        {/* )} */}
      </Modal>
    </>
  );
};
