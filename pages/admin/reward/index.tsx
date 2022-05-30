import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  AppShell,
  Badge,
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
import Fuse from "fuse.js";
import debounce from "lodash.debounce";
import { Search, Trophy } from "tabler-icons-react";

import { useAuth } from "contexts/auth.context";
import AdminSidebar from "components/admin-layout/AdminSidebar";
import { UpdatePackageModal } from "components/admin/exhibitor/UpdatePackageModal";
import { TableSkeleton } from "components/TableSkeleton";
import ReactHTMLTableToExcel from "components/table/ReactHTMLTableToExcel";
import { useExhibitors } from "services/exhibitor/hooks";
import { useActivityList } from "services/activity/hooks";

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

const AdminAward: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [openedUpdateModal, setOpenedUpdateModal] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<{
    id: number;
    name: string;
    company: string;
    package_id: number;
    package_name: string;
  }>();
  const [confirm, setConfirm] = useState<"confirm" | "all">("all");
  const [mode, setMode] = useState<"print" | "action">("action");
  const [querySearch, setQuerySearch] = useState("");

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  // const {
  //   data: exhibitors,
  //   isSuccess: isSuccessExhibitors,
  //   isLoading: isLoadingExhibitors,
  // } = useExhibitors({});
  // console.log({ exhibitors });

  const { data: activities, isLoading: isLoadingActivities } =
    useActivityList();

  // ==== Handle Search ====
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
  // ==== End Handle Search ====

  const fuse = new Fuse(activities || [], {
    keys: ["name", "email"],
    includeScore: true,
    isCaseSensitive: false,
  });

  const results = fuse.search(querySearch);
  const activitiesResult = querySearch
    ? results.map((result) => result.item)
    : activities;

  const ths = (
    <tr>
      {mode === "action" && <th>ID</th>}
      <th>Name</th>
      <th>Email</th>
      <th>Total Reward</th>
    </tr>
  );

  const rows = isLoadingActivities ? (
    <TableSkeleton rows={3} cols={5} />
  ) : (
    activitiesResult?.map((activity: any) => (
      <tr key={activity.id}>
        {mode === "action" && <td>{activity.id}</td>}
        <td>{activity.name}</td>
        <td>{activity.email}</td>
        <td>
          <Group spacing={4}>
            <Text sx={{ fontFamily: "monospace" }}>
              {activity.total_reward}
            </Text>
            <Trophy size={20} color="	#FFD700" />
          </Group>
        </td>
      </tr>
    ))
  );

  const action = (
    <Group mb={5} position="apart">
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
        <Switch
          label="Confirm"
          value={confirm}
          onChange={() =>
            setConfirm((v) => (v === "confirm" ? "all" : "confirm"))
          }
        />
      </Group>
    </Group>
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
          Reward
        </Title>
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

export default AdminAward;
