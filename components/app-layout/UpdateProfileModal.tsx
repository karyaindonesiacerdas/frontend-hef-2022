import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createStyles,
  Group,
  Box,
  Avatar,
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
  Center,
  Text,
  Stack,
  Anchor,
  PasswordInput,
} from "@mantine/core";
import { Trash, Trophy } from "tabler-icons-react";
import { useRouter } from "next/router";
import { useInputState, useLocalStorage, useOs } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { useQueryClient } from "react-query";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import ReactCanvasConfetti from "react-canvas-confetti";

import { useAuth } from "contexts/auth.context";
import { useMe } from "services/user/hooks";
import { getFileUrl } from "utils/file-storage";
import {
  changePassword,
  updateProfile,
  UpdateProfilePayload,
} from "services/auth.service";
import { usePackages } from "services/package/hooks/usePackages";
import { usePositions } from "services/position/hooks/usePositions";
import { trimString } from "utils/string";
import { useAppModal } from "contexts/modal.context";
import { countries } from "data/countries";
import { provinces } from "data/provinces";
import { NextLink } from "@mantine/next";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

const useStyles = createStyles((theme) => ({
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
  // country: z.string().optional(),
  province: z.string().optional(),
  institution_name: z.string().optional(),
  institution_type: z.string().optional(),
});

export const UpdateProfileModal = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const { data } = useMe();
  const { user, fromRegisterPhone } = useAuth();
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const [imgProfile, setImgProfile] = useState<any>();
  const [packageId, setPackageId] = useState<string[]>([]);
  const [isNewPassword, setIsNewPassword] = useLocalStorage({
    key: "new-password",
    defaultValue: "0",
  });

  const [step, setStep] = useState(
    router.query?.from === "register" && isNewPassword !== String(user?.id)
      ? 0
      : 1
  );
  const os = useOs();
  console.log({ query: router.query });

  // const [firstLogin, setFirstLogin] = useLocalStorage({
  //   key: "first-login",
  //   defaultValue: "true",
  // });
  const [showSuccess, setShowSuccess] = useState(true);
  const { openModal, setOpenModal } = useAppModal();
  const previewURL = imgProfile ? URL.createObjectURL(imgProfile) : "";

  // Start Confetti
  const refAnimationInstance = useRef<any>(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);
  // End Confetti

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      position_id: "",
      // country: "",
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
      description: p.description,
      link: p.link,
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
        // country: data?.country || "",
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
      province: values.province,
      institution_name: values.institution_name,
      institution_type: values.institution_type,
    };
    const fillAll =
      values.email &&
      values.name &&
      values.mobile &&
      values.position_id &&
      // values.country &&
      values.province &&
      values.institution_name &&
      values.institution_type;

    try {
      setVisible(true);
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
      if (fillAll) {
        fire();
        setStep(2);
      } else {
        setOpenModal(false);
      }
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
    !user.position_id ||
    !user.package_id ||
    !user.institution_name ||
    !user.institution_type;
  console.log({ openModal });
  console.log({ user });

  return (
    <>
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 10000,
        }}
      />
      <Modal
        centered
        closeOnClickOutside={false}
        opened={openModal && showUpdateForm}
        onClose={() => {
          setOpenModal(false);
        }}
        size="lg"
        title={
          <Title sx={(theme) => ({ fontSize: theme.fontSizes.lg })}>
            {step === 0
              ? "Change Password"
              : step === 1
              ? "Update Profile"
              : "Success"}
          </Title>
        }
      >
        {step === 0 && (
          <div>
            {showSuccess && (
              <Alert
                title={router.locale === "en" ? "Welcome!" : "Selamat Datang!"}
                color="teal"
                withCloseButton
                onClose={() => setShowSuccess(false)}
              >
                {router.locale === "en"
                  ? "Zoom link will be sent to your whatsapp number. Your current password is '12345'. Pleas change your password"
                  : "Link zoom akan dikirim ke nomor whatsapp anda. Password anda adalah '12345'. Mohon ubah password anda"}
              </Alert>
            )}
            <Box
              mt="md"
              component="form"
              onSubmit={form.onSubmit(handleSubmit)}
              style={{ position: "relative" }}
            >
              <ChangePassword onSuccess={() => setStep(1)} />
              <Divider my="md" label="Or" labelPosition="center" />
              <Button
                fullWidth
                variant="subtle"
                onClick={() => {
                  setStep(1);
                }}
              >
                Skip
              </Button>
            </Box>
          </div>
        )}
        {step === 1 && (
          <div>
            {showSuccess && (
              <Alert
                title={router.locale === "en" ? "Welcome!" : "Selamat Datang!"}
                color="teal"
                withCloseButton
                onClose={() => setShowSuccess(false)}
              >
                {router.locale === "en"
                  ? "Complete your identity data and get points"
                  : "Lengkapi data identitas anda dan dapatkan point"}
              </Alert>
            )}
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
                {/* {os === "ios" ? (
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
                )} */}

                {os === "ios" ? (
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
                )}
                <div />
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
                    checked={packageId?.includes(topic.value)}
                    label={
                      <div>
                        <Text
                          sx={(theme) => ({
                            [theme.fn.largerThan("sm")]: {
                              fontSize: theme.fontSizes.md,
                            },
                            fontSize: theme.fontSizes.sm,
                          })}
                        >
                          {topic.label}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {topic.description}{" "}
                          {topic.link ? (
                            <Anchor
                              size="xs"
                              href={topic.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              (Brosur)
                            </Anchor>
                          ) : (
                            ""
                          )}
                        </Text>
                      </div>
                    }
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
          </div>
        )}
        {step === 2 && (
          <Center mt="md" sx={{ width: "100%" }}>
            <Stack align="center" spacing={4}>
              <Trophy size={50} color="	#FFD700" />
              <Text
                mt="md"
                sx={(theme) => ({ fontSize: theme.fontSizes.xl * 1.2 })}
                weight={600}
              >
                {" "}
                {router.locale === "en" ? "Congratulations" : "Selamat"}
              </Text>
              <Text size="lg" weight={400}>
                {router.locale === "en"
                  ? "You get points for completing your identity data"
                  : "Anda mendapatkan point karena melengkapi data identitas"}
              </Text>
              <Text size="xs" color="dimmed">
                {router.locale === "en"
                  ? "Points will be used for the draw at the end of the event."
                  : "Point akan digunakan untuk undian diakhir acara."}{" "}
                <Anchor size="xs" component={NextLink} href="/app/my-account">
                  Details
                </Anchor>
              </Text>
              <Button
                mt="xl"
                fullWidth
                variant="light"
                onClick={() => setOpenModal(false)}
              >
                Close
              </Button>
            </Stack>
          </Center>
        )}
      </Modal>
    </>
  );
};

const ChangePassword = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useInputState("");
  const [changing, setChanging] = useState(false);
  const notifications = useNotifications();
  const { user } = useAuth();
  const [isNewPassword, setIsNewPassword] = useLocalStorage({
    key: "new-password",
    defaultValue: "0",
  });

  const handleChangePassword = async () => {
    try {
      setChanging(true);
      await changePassword(password);
      setChanging(false);
      setIsNewPassword(String(user?.id));
      notifications.showNotification({
        title: "Success",
        message: "Password changed successfully",
        color: "green",
      });
      onSuccess();
    } catch (error: any) {
      setChanging(false);
      notifications.showNotification({
        title: "Success",
        message: "Password changed successfully",
        color: "green",
      });
    }
  };

  return (
    <>
      <Box mt="md">
        <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          <PasswordInput
            label="New Password"
            placeholder="New Password"
            value={password}
            onChange={setPassword}
          />
        </SimpleGrid>
        <Button
          mt="md"
          fullWidth
          onClick={handleChangePassword}
          loading={changing}
        >
          Change
        </Button>
      </Box>
    </>
  );
};
