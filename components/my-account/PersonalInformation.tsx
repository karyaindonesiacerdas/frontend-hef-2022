import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  createStyles,
  Group,
  InputWrapper,
  LoadingOverlay,
  NativeSelect,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

import { useMe } from "services/user/hooks";
import { useNotifications } from "@mantine/notifications";
import { updateProfile, UpdateProfilePayload } from "services/auth.service";
import { useAuth } from "contexts/auth.context";
import { useQueryClient } from "react-query";
import { getFileUrl } from "utils/file-storage";
import { Trash } from "tabler-icons-react";
import { usePackages } from "services/package/hooks/usePackages";
import { usePositions } from "services/position/hooks/usePositions";
import { useOs } from "@mantine/hooks";
import { trimString } from "utils/string";
import { institutionTypes } from "../app-layout/UpdateProfileModal";
import { countries } from "data/countries";
import { provinces } from "data/provinces";

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

type Props = {
  title?: string;
};

const PersonalInformation = ({ title }: Props) => {
  const { classes } = useStyles();
  const { data } = useMe();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const [imgProfile, setImgProfile] = useState<any>();
  const [packageId, setPackageId] = useState<string[]>([]);
  const os = useOs();

  const previewURL = imgProfile ? URL.createObjectURL(imgProfile) : "";

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
      mobile: values.mobile?.trim(),
      img_profile: imgProfile || undefined,
      position_id: Number(values.position_id),
      package_id: packageId?.map((p) => +p),
      // country: values.country,
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
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error change personal information",
        color: "red",
      });
    }
  };

  return (
    <>
      <LoadingOverlay visible={visible} />
      <Title className={classes.sectionTitle} order={2}>
        {title || "Personal Information"}
      </Title>
      <Box mt="md" component="form" onSubmit={form.onSubmit(handleSubmit)}>
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
              disabled={i < 4}
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
        <Group mt="xs" position="right">
          <Button type="submit">Save</Button>
        </Group>
      </Box>
    </>
  );
};

export default PersonalInformation;
