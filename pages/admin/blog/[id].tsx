import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  Input,
  InputWrapper,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Skeleton,
  Switch,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { TrashX } from "tabler-icons-react";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import DropzoneChildren from "components/DropzoneChildren";
import {
  addBlog,
  AddBlogPayload,
  deleteBlog,
  updateBlog,
  UpdateBlogPayload,
} from "services/blog";
import RichText from "components/RichText";
import { useBlog } from "services/blog/hooks";
import { formatDate } from "utils/date";

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

const schema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string().nonempty(),
});

const AdminEditBlog: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes } = useStyles();
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<{ src: string; filename: string }>();
  const [imageError, setImageError] = useState("");
  const [contentError, setContentError] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [targetName, setTargetName] = useState("");
  const theme = useMantineTheme();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      title: "",
      subtitle: "",
    },
  });
  const { setValues } = form;

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const { data: blog, isLoading } = useBlog(String(router?.query?.id) || "");

  useEffect(() => {
    setValues({ title: blog?.title || "", subtitle: blog?.subtitle || "" });
    setImage(blog?.image);
    setPublished(blog?.published || false);
    setContent(blog?.content || "");
  }, [blog, setValues]);

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
    if (!image) return;

    try {
      setLoadingImage(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/upload`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: image?.filename,
        }),
      });

      await res.json();
      setLoadingImage(false);
      setImage(undefined);
    } catch (error) {
      setLoadingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!router.query.id) return;
    setLoadingDelete(true);
    try {
      await deleteBlog(String(router.query.id));
      await queryClient.invalidateQueries(["blogs"]);
      notifications.showNotification({
        title: "Success",
        message: "Blog deleted!",
        color: "green",
      });
      router.push("/admin/blog");
    } catch (error: any) {
      setLoadingDelete(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
  };

  const handleRichTextImageUpload = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", file);

      fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log({ result });
          resolve(result.data.path);
        })
        .catch(() => reject(new Error("Upload failed")));
    });

  const handleSubmit = async (values: typeof form.values) => {
    if (!router.query.id) return;
    if (!image) {
      setImageError("Required");
      return;
    }
    if (!content) {
      setContentError("Required");
      return;
    }

    const payload: UpdateBlogPayload = {
      title: values.title,
      subtitle: values.subtitle,
      published,
      image,
      content,
    };
    setVisible(true);
    try {
      await updateBlog(String(router.query.id), payload);
      await queryClient.invalidateQueries("blogs");
      notifications.showNotification({
        title: "Success",
        message: "Blog edited!",
        color: "green",
      });
      router.push("/admin/blog");
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
  };

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <AppShell
      navbar={<AdminSidebar />}
      styles={(theme) => ({
        main: {
          height: "100vh",
          overflow: "auto",
          padding: theme.spacing.xs,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        },
      })}
    >
      <Container size={1700}>
        <Link href="/admin/blog" passHref>
          <Anchor>&larr; Back to blog list</Anchor>
        </Link>
        <Title mt="xs" order={2} px={3}>
          Edit Blog
        </Title>
        <SimpleGrid mt="md" cols={2}>
          <div>
            <Paper
              shadow="sm"
              py="md"
              px="lg"
              withBorder
              style={{ position: "relative" }}
            >
              <LoadingOverlay visible={visible} />
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  required
                  label="Title"
                  mb="sm"
                  {...form.getInputProps("title")}
                />
                <TextInput
                  required
                  label="Subtitle"
                  mb="sm"
                  {...form.getInputProps("subtitle")}
                />
                <InputWrapper label="image" required error={imageError}>
                  {loadingImage ? (
                    <Skeleton mb="sm" className={classes.skeleton} />
                  ) : image ? (
                    <Box mb="sm" className={classes.imageWrapper}>
                      <div className={classes.image}>
                        <Image
                          fit="contain"
                          height={150}
                          src={image.src}
                          alt="image Preview"
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
                          setImage({
                            src: result.data.path,
                            filename: result.data.filename,
                          });
                          setLoadingImage(false);
                        } catch (error) {
                          setLoadingImage(false);
                        }
                      }}
                      onReject={(files) => setImage(undefined)}
                      maxSize={3 * 1024 ** 2}
                      accept={IMAGE_MIME_TYPE}
                    >
                      {/* {(status) => dropzoneChildren(status, theme)} */}
                      {(status) => (
                        <DropzoneChildren status={status} theme={theme} />
                      )}
                    </Dropzone>
                  )}
                </InputWrapper>
                <InputWrapper label="Published" mb="sm">
                  <Switch
                    aria-label="status"
                    checked={published}
                    onChange={(event) =>
                      setPublished(event.currentTarget.checked)
                    }
                  />
                </InputWrapper>
                <InputWrapper label="Content" required error={contentError}>
                  <RichText
                    value={content}
                    onChange={setContent}
                    onImageUpload={handleRichTextImageUpload}
                  />
                </InputWrapper>
                <Group mt="lg" position="right">
                  <Button type="submit">Save</Button>
                </Group>
              </form>
            </Paper>
            <Paper
              mt="md"
              shadow="sm"
              py="md"
              px="lg"
              withBorder
              style={{ position: "relative" }}
            >
              <Title order={4}>Delete Blog</Title>
              <Text mt="sm">
                This action cannot be undone. This will permanently delete the{" "}
                <span style={{ fontWeight: "bold" }}>{blog?.title}</span> blog.
              </Text>
              <Group mt="md" align="end">
                <TextInput
                  style={{ flex: 1 }}
                  label={`Please type "${blog?.title}" to confirm.`}
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                />
                <Button
                  variant="filled"
                  color="red"
                  disabled={blog?.title !== targetName}
                  type="button"
                  onClick={handleDelete}
                  loading={loadingDelete}
                >
                  Delete this blog
                </Button>
              </Group>
            </Paper>
          </div>
          <Paper shadow="sm" py="md" px="lg" withBorder>
            <Title order={1} align="center">
              {form.values.title}
            </Title>
            <Text mt="xs" size="lg" align="center">
              {form.values.subtitle}
            </Text>
            <Text mt="xs" mb="md" size="sm" align="center">
              {blog?.createdAt
                ? formatDate(blog?.createdAt)
                : formatDate(new Date().toISOString())}
            </Text>
            {image?.src && (
              <Image mt="lg" src={image.src} alt="Preview" height={300} />
            )}
            <TypographyStylesProvider className="rich-text-image">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </TypographyStylesProvider>
          </Paper>
        </SimpleGrid>
      </Container>
    </AppShell>
  );
};

export default AdminEditBlog;
