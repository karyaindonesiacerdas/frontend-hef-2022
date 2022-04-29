import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  TextInput,
  createStyles,
  MantineTheme,
  useMantineTheme,
  Text,
  InputWrapper,
  Skeleton,
  Image,
  Box,
  Center,
  ActionIcon,
  Accordion,
  Title,
  Divider,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  Upload,
  Photo,
  X,
  Icon as TablerIcon,
  TrashX,
  AlertTriangle,
} from "tabler-icons-react";

import {
  updateSponsor,
  UpdateSponsorPayload,
  deleteSponsor,
} from "services/sponsor";

const schema = z.object({
  name: z.string().nonempty(),
  level: z.string().nonempty(),
});

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 80, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={40}
    />

    <div>
      <Text size="lg" inline align="center">
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" align="center" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

const useStyles = createStyles((theme) => ({
  skeleton: {
    height: 180,
  },
  imageWrapper: { position: "relative", height: 180, overflow: "hidden" },
  image: {
    objectFit: "cover",
    objectPosition: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageAction: {
    background: "#000",
    opacity: 0,
    height: 180,
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

type Sponsor = {
  _id: string;
  name: string;
  level: string;
  logo: {
    src: string;
    filename: string;
  };
};

type EditAndDeleteSponsorModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSponsor?: Sponsor;
  setSelectedSponsor: Dispatch<SetStateAction<Sponsor | undefined>>;
};

export const EditAndDeleteSponsorModal = ({
  opened,
  setOpened,
  selectedSponsor,
  setSelectedSponsor,
}: EditAndDeleteSponsorModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [loadingImage, setLoadingImage] = useState(false);
  const [logo, setLogo] = useState<{ src: string; filename: string }>();
  const [logoError, setLogoError] = useState("");

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      name: selectedSponsor?.name || "",
      level: selectedSponsor?.level || "",
    },
  });
  const { setValues } = form;

  useEffect(() => {
    if (selectedSponsor) {
      setValues({
        name: selectedSponsor?.name,
        level: selectedSponsor?.level,
      });
      setLogo(selectedSponsor?.logo);
    }
  }, [selectedSponsor, setValues]);

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/upload`, {
      method: "POST",
      body: formData,
    });

    return await res.json();
  };

  const handleDeleteImage = async () => {
    if (!logo) return;

    try {
      setLoadingImage(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/upload`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: logo?.filename,
        }),
      });

      await res.json();
      setLoadingImage(false);
      setLogo(undefined);
    } catch (error) {
      setLoadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSponsor) return;

    setVisible(true);
    try {
      await deleteSponsor(selectedSponsor?._id);
      await queryClient.invalidateQueries("sponsors");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Sponsor deleted!",
        color: "green",
      });
      setOpened(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedSponsor) return;
    if (!logo) {
      setLogoError("Required");
      return;
    }
    const payload: UpdateSponsorPayload = {
      name: values.name,
      level: values.level,
      logo: {
        src: logo?.src,
        filename: logo?.filename,
      },
    };
    setVisible(true);
    try {
      await updateSponsor(selectedSponsor?._id, payload);
      await queryClient.invalidateQueries("sponsors");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Sponsor added!",
        color: "green",
      });
      form.reset();
      setOpened(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setLogo(undefined);
        setSelectedSponsor(undefined);
        form.reset();
        setOpened(false);
      }}
      title={"Edit Sponsor"}
      styles={(theme) => ({
        header: {
          fontWeight: 700,
        },
        modal: {
          position: "relative",
        },
      })}
    >
      <LoadingOverlay visible={visible} />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Company Name"
          mb="sm"
          {...form.getInputProps("name")}
        />

        <Select
          required
          label="Level"
          mb="sm"
          nothingFound="No option"
          data={[
            {
              label: "Platinum",
              value: "Platinum",
            },
            {
              label: "Gold",
              value: "Gold",
            },
            {
              label: "Silver",
              value: "Silver",
            },
          ]}
          {...form.getInputProps("level")}
        />

        <InputWrapper label="Logo" required error={logoError}>
          {loadingImage ? (
            <Skeleton mb="sm" className={classes.skeleton} />
          ) : logo ? (
            <Box mb="sm" className={classes.imageWrapper}>
              <div className={classes.image}>
                <Image
                  fit="contain"
                  height={150}
                  src={logo.src}
                  alt="logo Preview"
                />
              </div>
              <Center className={classes.imageAction}>
                <ActionIcon
                  color="red"
                  p="sm"
                  size={60}
                  onClick={handleDeleteImage}
                >
                  <TrashX size={60} />
                </ActionIcon>
              </Center>
            </Box>
          ) : (
            <Dropzone
              mb="sm"
              onDrop={async (files) => {
                try {
                  setLoadingImage(true);
                  const result = await uploadImage(files[0]);
                  const newLogo = {
                    src: result.data.path,
                    filename: result.data.filename,
                  };
                  if (selectedSponsor) {
                    await updateSponsor(selectedSponsor?._id, {
                      logo: newLogo,
                    });
                    await queryClient.invalidateQueries("sponsors");
                  }
                  setLogo(newLogo);
                  setLoadingImage(false);
                } catch (error) {
                  setLoadingImage(false);
                }
              }}
              onReject={(files) => setLogo(undefined)}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              {(status) => dropzoneChildren(status, theme)}
            </Dropzone>
          )}
        </InputWrapper>

        <Button type="submit" fullWidth>
          Save
        </Button>
        <Divider label="or" labelPosition="center" my="sm" />
        <Accordion iconPosition="right">
          <Accordion.Item
            label="Delete Sponsor"
            style={{ border: "none", fontSize: 14 }}
            color="red"
          >
            <Group position="apart" p={4}>
              <div>
                <Text>Are you sure to delete this sponsor?</Text>
              </div>
              <Button
                onClick={handleDelete}
                variant="light"
                type="button"
                color="red"
              >
                Delete
              </Button>
            </Group>
          </Accordion.Item>
        </Accordion>
      </form>
    </Modal>
  );
};

export default EditAndDeleteSponsorModal;
