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
  Title,
} from "@mantine/core";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";
import { Search } from "tabler-icons-react";

import { useAuth } from "contexts/auth.context";
import AdminSidebar from "components/admin-layout/AdminSidebar";
import { UpdatePackageModal } from "components/admin/exhibitor/UpdatePackageModal";
import { TableSkeleton } from "components/TableSkeleton";
import ReactHTMLTableToExcel from "components/table/ReactHTMLTableToExcel";
import { useExhibitors } from "services/exhibitor/hooks";
import DeleteFromExhibitorModal from "@/components/admin/exhibitor/DeleteFromExhibitorModal";

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

const AdminExhibitor: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [openedUpdateModal, setOpenedUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<{
    id: number;
    name: string;
    company: string;
    package_id: number;
    package_name: string;
    position: number;
    exhibitor_type: string | null;
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

  const {
    data: exhibitors,
    isSuccess: isSuccessExhibitors,
    isLoading: isLoadingExhibitors,
  } = useExhibitors({});
  console.log({ exhibitors });

  const filteredExhibitors =
    exhibitors?.filter((e: any) =>
      confirm === "confirm" ? e.package_id : true
    ) || [];

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

  const fuse = new Fuse(filteredExhibitors, {
    keys: ["name", "company_name"],
    includeScore: true,
    isCaseSensitive: false,
  });

  const results = fuse.search(querySearch);
  const exhibitorResults = querySearch
    ? results.map((result) => result.item)
    : filteredExhibitors;

  const ths = (
    <tr>
      {mode === "action" && <th>ID</th>}
      <th>Name</th>
      <th>Company</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>Package</th>
      <th>Booth Position</th>
      {mode === "action" && <th>Action</th>}
    </tr>
  );

  const rows = isLoadingExhibitors ? (
    <TableSkeleton rows={3} cols={8} />
  ) : (
    exhibitorResults?.map((exhibitor) => (
      <tr key={exhibitor.id}>
        {mode === "action" && <td>{exhibitor.id}</td>}
        <td>{exhibitor.name}</td>
        <td>{exhibitor.company_name}</td>
        <td>{exhibitor.email}</td>
        <td>{exhibitor.mobile}</td>
        <td>
          <Badge
            radius="sm"
            color={
              exhibitor.exhibitor_type === "Meteorite"
                ? "gray"
                : exhibitor.exhibitor_type === "Satellite"
                ? "red"
                : exhibitor.exhibitor_type === "Planet"
                ? "orange"
                : exhibitor.exhibitor_type === "Star"
                ? "violet"
                : exhibitor.exhibitor_type === "Galaxy"
                ? "pink"
                : exhibitor.exhibitor_type === "Ala Carte"
                ? "blue"
                : "gray"
            }
            variant={exhibitor.exhibitor_type ? "filled" : "light"}
            // color="gray"
          >
            {exhibitor.exhibitor_type ? exhibitor.exhibitor_type : "No Package"}
          </Badge>
        </td>

        <td>{exhibitor.position}</td>

        {mode === "action" && (
          <td>
            <Group>
              <Button
                size="xs"
                onClick={() => {
                  setSelectedExhibitor({
                    id: exhibitor.id,
                    name: exhibitor.name,
                    company: exhibitor.company_name,
                    package_id: exhibitor.package_id,
                    package_name: exhibitor.package?.name,
                    position: exhibitor.position,
                    exhibitor_type: exhibitor.exhibitor_type,
                  });
                  setOpenedUpdateModal(true);
                }}
                variant="light"
                color="blue"
              >
                Update Status
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  setSelectedExhibitor({
                    id: exhibitor.id,
                    name: exhibitor.name,
                    company: exhibitor.company_name,
                    package_id: exhibitor.package_id,
                    package_name: exhibitor.package?.name,
                    position: exhibitor.position,
                    exhibitor_type: exhibitor.exhibitor_type,
                  });
                  setOpenDeleteModal(true);
                }}
                variant="light"
                color="red"
              >
                Remove
              </Button>
            </Group>
          </td>
        )}
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
          Exhibitors
        </Title>
        <UpdatePackageModal
          opened={openedUpdateModal}
          setOpened={setOpenedUpdateModal}
          selectedExhibitor={selectedExhibitor}
        />
        <DeleteFromExhibitorModal
          opened={openDeleteModal}
          setOpened={setOpenDeleteModal}
          id={selectedExhibitor?.id || 0}
          name={selectedExhibitor?.name || ""}
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

export default AdminExhibitor;
