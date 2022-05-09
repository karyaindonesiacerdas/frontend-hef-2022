import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppShell,
  Badge,
  Button,
  Container,
  createStyles,
  Group,
  Image,
  ScrollArea,
  Table,
  Title,
} from "@mantine/core";
import { format } from "timeago.js";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { useBlogs } from "services/blog/hooks";
import { TableSkeleton } from "components/TableSkeleton";
import { Plus, Send } from "tabler-icons-react";
import NoContent from "components/NoContent";
import { useNotifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const AdminBlog: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const notifications = useNotifications();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const { data: blogs, isLoading } = useBlogs();

  const handleRevalidate = async () => {
    try {
      setRevalidating(true);
      const res = await fetch(`/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageUrl: "/" }),
      });
      setRevalidating(false);
      notifications.showNotification({
        title: "Published",
        message: "New web published",
        color: "green",
      });
    } catch (error) {
      console.log({ error });
      setRevalidating(false);
      notifications.showNotification({
        title: "Failed",
        message: "Error publishing new website",
        color: "red",
      });
    }
  };

  const ths = (
    <tr>
      <th>Title</th>
      <th>Subtitle</th>
      <th>Image</th>
      <th>Status</th>
      <th>Created</th>
      <th>Last update</th>
      <th>Action</th>
    </tr>
  );

  const rows = isLoading ? (
    <TableSkeleton rows={3} cols={5} />
  ) : (
    blogs?.map((blog) => (
      <tr key={blog._id}>
        <td>{blog.title}</td>
        <td>{blog.subtitle}</td>
        <td>
          {
            <Image
              radius="xl"
              width={30}
              height={30}
              fit="cover"
              src={blog.image.src}
              alt={blog.title}
            />
          }
        </td>
        <td>
          <Badge color={blog.published ? "green" : "gray"}>
            {blog.published ? "Published" : "Draft"}
          </Badge>
        </td>
        <td>{format(new Date(blog.createdAt))}</td>
        <td>{format(new Date(blog.updatedAt))}</td>

        <td>
          <Link href={`/admin/blog/${blog._id}`} passHref>
            <Button component="a" variant="light" color="blue">
              Edit
            </Button>
          </Link>
        </td>
      </tr>
    ))
  );

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
        <Group position="apart">
          <Title order={2} px={3}>
            Blog
          </Title>
          <Group>
            <Button
              onClick={handleRevalidate}
              loading={revalidating}
              variant="light"
              leftIcon={<Send size={16} />}
            >
              Publish Changes
            </Button>
            {blogs?.length ? (
              <Link href="/admin/blog/add" passHref>
                <Button component="a" leftIcon={<Plus size={16} />}>
                  Add New Blog
                </Button>
              </Link>
            ) : null}
          </Group>
        </Group>
        <div className={classes.root}>
          {!blogs?.length ? (
            <NoContent
              text="No Blog"
              action={
                <Link href="/admin/blog/add" passHref>
                  <Button component="a" leftIcon={<Plus size={16} />}>
                    Add New Blog
                  </Button>
                </Link>
              }
            />
          ) : (
            <ScrollArea
              sx={{ height: "75vh" }}
              onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
            >
              <Table id="table-to-xls">
                <thead
                  className={cx(classes.header, {
                    [classes.scrolled]: scrolled,
                  })}
                >
                  {ths}
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </Container>
    </AppShell>
  );
};

export default AdminBlog;
