import { ChangeEvent, useEffect, useState, useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Badge,
  Breadcrumbs,
  Button,
  Container,
  createStyles,
  Group,
  Input,
  ScrollArea,
  Switch,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { ChevronRight, Edit, Search, Trash } from "tabler-icons-react";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";

import { useAuth } from "contexts/auth.context";
import { useRundowns } from "services/rundown/hooks";
import { formatDate } from "utils/date";
import AdminSidebar from "components/admin-layout/AdminSidebar";
import { Rundown } from "components/admin/rundown/UpdateRundownModal";
import { TableSkeleton } from "components/TableSkeleton";
import ReactHTMLTableToExcel from "components/table/ReactHTMLTableToExcel";

const AddRundownModal = dynamic(
  () => import("components/admin/rundown/AddRundownModal"),
  { ssr: false }
);
const UpdateRundownModal = dynamic(
  () => import("components/admin/rundown/UpdateRundownModal"),
  { ssr: false }
);
const DeleteRundownModal = dynamic(
  () => import("components/admin/rundown/DeleteRundownModal"),
  { ssr: false }
);

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

const AdminWebinarDate: NextPage = () => {
  const router = useRouter();
  const { date } = router.query;
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [openedAddModal, setOpenedAddModal] = useState(false);
  const [openedUpdateModal, setOpenedUpdateModal] = useState(false);
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [selectedRundown, setSelectedRundown] = useState<Rundown>();
  const [mode, setMode] = useState<"print" | "action">("action");
  const [querySearch, setQuerySearch] = useState("");

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuerySearch(event.target.value);
  };

  const debounceHandleSearchChange = useMemo(
    () => debounce(handleSearchChange, 500),
    []
  );

  useEffect(() => {
    return () => debounceHandleSearchChange.cancel();
  }, [debounceHandleSearchChange]);

  const { data: rundowns, isLoading: isLoadingRundowns } = useRundowns();

  const currentRundowns =
    rundowns
      ?.filter((rundown) => rundown.date === date)
      .map((rundown) => ({
        id: rundown.id,
        title: rundown.title,
        subtitle: rundown.subtitle,
        speakers: rundown.speakers,
        position: rundown.position,
        date: rundown.date,
        time: rundown.time,
        status: rundown.status,
        embedd_link: rundown.embedd_link,
        attachment_link: rundown.attachment_link,
      })) || [];

  const fuse = new Fuse(currentRundowns, {
    keys: ["title", "speakers", "subtitle"],
    includeScore: true,
    isCaseSensitive: false,
  });

  const results = fuse.search(querySearch);
  const rundownResults = querySearch
    ? results.map((result) => result.item)
    : currentRundowns;

  const action = (
    <Group position="apart" align="center" mb="sm">
      <Input
        icon={<Search size={16} />}
        placeholder="Search..."
        type="text"
        aria-label="Search"
        onChange={debounceHandleSearchChange}
      />
      <Group>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="tablexls"
          sheet="tablexls"
          buttonText="Download as XLS"
        />
        <Switch
          label="Print Mode"
          value={mode}
          onChange={() => setMode((v) => (v === "print" ? "action" : "print"))}
        />
        <Button onClick={() => setOpenedAddModal(true)}>Add Rundown</Button>
      </Group>
    </Group>
  );

  const ths = (
    <tr>
      <th>Date</th>
      <th>Time</th>
      <th>Title</th>
      <th>Speaker</th>
      <th>Status</th>
      <th>Video</th>
      <th>Material</th>
      {mode === "action" && <th>Action</th>}
    </tr>
  );

  const rows = isLoadingRundowns ? (
    <TableSkeleton rows={3} cols={8} />
  ) : (
    rundownResults?.map((rundown) => (
      <tr key={rundown.id}>
        <td>{rundown.date}</td>
        <td>{rundown.time}</td>
        <td style={{ maxWidth: 250 }}>
          <Text size="sm" weight={600}>
            {rundown.title}
          </Text>
          <Text size="sm" color="gray">
            {rundown.subtitle}
          </Text>
        </td>
        <td style={{ maxWidth: 250 }}>
          <Text size="sm" weight={600}>
            {rundown.speakers}
          </Text>
          <Text size="sm" color="gray">
            {rundown.position}
          </Text>
        </td>
        <td>
          <Badge
            variant="filled"
            color={
              rundown.status === 1
                ? "gray"
                : rundown.status === 2
                ? "yellow"
                : rundown.status === 3
                ? "green"
                : "gray"
            }
          >
            {rundown.status === 1
              ? "Upcoming"
              : rundown.status === 2
              ? "Now Showing"
              : rundown.status === 3
              ? "Done"
              : ""}
          </Badge>
        </td>
        <td>
          {rundown.embedd_link && (
            <Anchor
              href={rundown.embedd_link}
              target="_blank"
              weight={600}
              size="sm"
            >
              {mode === "action" ? "Link Video" : rundown.embedd_link}
            </Anchor>
          )}
        </td>
        <td>
          {rundown.attachment_link && (
            <Anchor
              href={rundown.attachment_link}
              target="_blank"
              weight={600}
              size="sm"
            >
              {mode === "action" ? "Link Material" : rundown.attachment_link}
            </Anchor>
          )}
        </td>
        {mode === "action" && (
          <td>
            <Group>
              <ActionIcon
                onClick={() => {
                  setSelectedRundown(rundown);
                  setOpenedUpdateModal(true);
                }}
                variant="light"
                color="blue"
              >
                <Edit size={20} />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  setSelectedRundown(rundown);
                  setOpenedDeleteModal(true);
                }}
                variant="light"
                color="red"
              >
                <Trash size={20} />
              </ActionIcon>
            </Group>
          </td>
        )}
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
        <Title order={2} px={3}>
          Webinar {date && formatDate(String(date))}
        </Title>
        <Breadcrumbs separator={<ChevronRight size={16} />} mt="md" px={5}>
          <NextLink style={{ textDecoration: "none" }} href="/admin/webinar">
            <Anchor component="span" weight={600}>
              Webinar
            </Anchor>
          </NextLink>
          <NextLink
            style={{ textDecoration: "none" }}
            href={`/admin/webinar/${date}`}
          >
            <Anchor component="span" weight={600}>
              {formatDate(String(date))}
            </Anchor>
          </NextLink>
        </Breadcrumbs>
        <AddRundownModal
          opened={openedAddModal}
          setOpened={setOpenedAddModal}
        />
        <UpdateRundownModal
          selectedRundown={selectedRundown}
          opened={openedUpdateModal}
          setOpened={setOpenedUpdateModal}
        />
        <DeleteRundownModal
          selectedRundown={selectedRundown}
          opened={openedDeleteModal}
          setOpened={setOpenedDeleteModal}
        />
        <div className={classes.root}>
          {action}
          <ScrollArea
            sx={{ height: "75vh" }}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Table id="table-to-xls">
              <thead
                className={cx(classes.header, { [classes.scrolled]: scrolled })}
              >
                {ths}
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </div>
      </Container>
    </AppShell>
  );
};

export default AdminWebinarDate;
