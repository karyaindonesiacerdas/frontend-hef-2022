import React, { useEffect, useState } from "react";
import {
  Button,
  createStyles,
  Drawer,
  Group,
  Image,
  Input,
  InputWrapper,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Tabs,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import ImageInput from "../dropzone/ImageInput";
import { useForm } from "@mantine/form";
import { Banner, Exhibitor, useExhibitor } from "services/exhibitor/hooks";
import {
  register,
  updateExhibitor,
  UpdateExhibitorPayload,
} from "services/auth.service";
import { getFileUrl } from "utils/file-storage";
import { useNotifications } from "@mantine/notifications";
import { uploadBanner, UploadBannerPayload } from "services/banner";
import { useQueryClient } from "react-query";

type Props = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  exhibitor: Exhibitor;
};

const EditBoothDrawer = ({ exhibitor, opened, setOpened }: Props) => {
  const theme = useMantineTheme();

  console.log({ exhibitor });

  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={1} style={{ fontSize: theme.fontSizes.xl }}>
          Edit Content
        </Title>
      }
      padding="xl"
      size="90vw"
      styles={{
        drawer: {
          overflow: "auto",
        },
      }}
    >
      <Tabs>
        <Tabs.Tab label="Company Info">
          <Title
            order={2}
            mb="md"
            mt="sm"
            style={{ fontSize: theme.fontSizes.lg }}
          >
            Company Info
          </Title>
          <Paper shadow="xs" withBorder p="md" style={{ maxWidth: 800 }}>
            <CompanyInfoForm exhibitor={exhibitor} />
          </Paper>
        </Tabs.Tab>
        <Tabs.Tab label="Name Card & Catalog">
          <Title
            order={2}
            mb="md"
            mt="sm"
            style={{ fontSize: theme.fontSizes.lg }}
          >
            Name Card & Catalog
          </Title>
          <SimpleGrid cols={2} style={{ maxWidth: 800 }}>
            <Paper shadow="xs" withBorder p="md">
              <NameCardForm
                banner={exhibitor?.banners?.find(
                  (banner) => banner.order === 11
                )}
              />
            </Paper>
            <Paper shadow="xs" withBorder p="md">
              <CatalogForm
                banner={exhibitor?.banners?.find(
                  (banner) => banner.order === 12
                )}
              />
            </Paper>
          </SimpleGrid>
        </Tabs.Tab>
        <Tabs.Tab label="Poster">
          <Title
            order={2}
            mb="md"
            mt="sm"
            style={{ fontSize: theme.fontSizes.lg }}
          >
            Poster
          </Title>
          <SimpleGrid mt="md" cols={5}>
            {[1, 2, 3, 4, 5].map((order) => (
              <Paper key={order} shadow="xs" withBorder p="md">
                <PosterForm
                  banner={exhibitor?.banners?.find(
                    (banner) => banner.order === order
                  )}
                  order={order}
                  label={`Poster ${order}`}
                />
              </Paper>
            ))}
          </SimpleGrid>
        </Tabs.Tab>
      </Tabs>
    </Drawer>
  );
};

export default EditBoothDrawer;

type PosterFormProps = {
  order: number;
  label?: string;
  banner?: Banner;
};

const PosterForm = ({ order, label, banner }: PosterFormProps) => {
  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState("");
  const theme = useMantineTheme();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();

  const form = useForm({
    initialValues: {
      display_name: "",
    },
  });
  const { setValues } = form;

  useEffect(() => {
    if (banner) {
      setValues({ display_name: banner?.display_name });
    }
  }, [setValues, banner]);

  const handleSubmit = async (values: typeof form.values) => {
    const payload: UploadBannerPayload = {
      display_name: values.display_name,
      image: image,
      order,
    };
    try {
      setVisible(true);
      await uploadBanner(payload);
      notifications.showNotification({
        title: "Success",
        message: "Poster updated",
        color: "green",
      });
      setVisible(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error update poster",
        color: "red",
      });
    }
  };

  return (
    <>
      <Title order={3} style={{ fontSize: theme.fontSizes.md }}>
        {label}
      </Title>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ position: "relative" }}
      >
        <LoadingOverlay visible={visible} />
        <ImageInput
          image={image}
          setImage={setImage}
          imageError={imageError}
          setImageError={setImageError}
          currentImage={banner?.image && getFileUrl(banner.image, "banner")}
        />
        <TextInput
          required
          label="Display Name"
          {...form.getInputProps("display_name")}
        />
        <Button fullWidth mt="md" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

const NameCardForm = ({ banner }: { banner?: Banner }) => {
  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState("");
  const theme = useMantineTheme();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: UploadBannerPayload = {
      display_name: "Name Card",
      image: image,
      order: 11,
    };
    try {
      setVisible(true);
      await uploadBanner(payload);
      notifications.showNotification({
        title: "Success",
        message: "Name card updated",
        color: "green",
      });
      setVisible(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error update name card",
        color: "red",
      });
    }
  };

  return (
    <>
      <Title order={3} style={{ fontSize: theme.fontSizes.md }}>
        Name Card
      </Title>
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
        <LoadingOverlay visible={visible} />
        <ImageInput
          image={image}
          setImage={setImage}
          imageError={imageError}
          setImageError={setImageError}
          currentImage={banner?.image && getFileUrl(banner.image, "banner")}
        />
        <Button disabled={!image} fullWidth mt="md" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

const CatalogForm = ({ banner }: { banner?: Banner }) => {
  const [image, setImage] = useState<File | null>();
  const [imageError, setImageError] = useState("");
  const theme = useMantineTheme();
  const [visible, setVisible] = useState(false);
  const notifications = useNotifications();

  console.log({ banner });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) return;
    const payload: UploadBannerPayload = {
      display_name: "Catalog",
      image: image,
      order: 12,
    };
    try {
      setVisible(true);
      await uploadBanner(payload);
      notifications.showNotification({
        title: "Success",
        message: "Catalog updated",
        color: "green",
      });
      setVisible(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error update catalog",
        color: "red",
      });
    }
  };

  return (
    <>
      <Title order={3} style={{ fontSize: theme.fontSizes.md }}>
        Catalog
      </Title>
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
        <LoadingOverlay visible={visible} />
        <InputWrapper mt="md">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setImage(e.target.files && e.target.files[0])}
          />
        </InputWrapper>

        {/* <ImageInput
          image={image}
          setImage={setImage}
          imageError={imageError}
          setImageError={setImageError}
        /> */}
        <Button fullWidth mt="md" type="submit" disabled={!image}>
          Save
        </Button>
      </form>
    </>
  );
};

const CompanyInfoForm = ({ exhibitor }: { exhibitor: Exhibitor }) => {
  const [image, setImage] = useState<File>();
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      company_name: "",
      email: "",
      mobile: "",
      company_website: "",
      company_video_url: "",
    },
  });
  const { setValues } = form;

  useEffect(() => {
    setValues({
      company_name: exhibitor.company_name,
      company_video_url: exhibitor.company_video_url,
      company_website: exhibitor.company_website,
      email: exhibitor.email,
      mobile: exhibitor.mobile,
    });
  }, [setValues, exhibitor]);

  const handleSubmit = async (values: typeof form.values) => {
    const payload: UpdateExhibitorPayload = {
      company_logo: image,
      company_name: values.company_name,
      company_video_url: values.company_video_url,
      company_website: values.company_website,
      email: values.email,
    };
    try {
      setIsLoading(true);
      await updateExhibitor(payload);
      await queryClient.invalidateQueries("exhibitors");
      notifications.showNotification({
        title: "Success",
        message: "Company info updated",
        color: "green",
      });
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error update company info",
        color: "red",
      });
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      style={{ position: "relative" }}
    >
      <LoadingOverlay visible={isLoading} />
      <SimpleGrid cols={2}>
        <TextInput
          label="Company Name"
          {...form.getInputProps("company_name")}
        />
        <TextInput label="Company Email" {...form.getInputProps("email")} />
        <TextInput
          label="Company Website"
          {...form.getInputProps("company_website")}
        />
        <TextInput label="Company Phone" {...form.getInputProps("mobile")} />
      </SimpleGrid>
      <TextInput
        mt="md"
        mb="md"
        label="Company Video URL"
        {...form.getInputProps("company_video_url")}
      />
      <SimpleGrid cols={2} style={{ alignItems: "center" }}>
        <ImageInput
          label="Company Logo"
          image={image}
          setImage={setImage}
          imageError={imageError}
          setImageError={setImageError}
        />
        <Image
          src={
            exhibitor.company_logo
              ? getFileUrl(exhibitor.company_logo, "companies")
              : "/hef-2022/logoipsum.svg"
          }
          alt={exhibitor.company_name}
          height={100}
          fit="contain"
        />
      </SimpleGrid>
      <Group mt="md" position="right">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
};
