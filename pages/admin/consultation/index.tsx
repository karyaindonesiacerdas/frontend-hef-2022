import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ActionIcon,
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
import { Edit, Search, Trash } from "tabler-icons-react";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";

import { useAuth } from "contexts/auth.context";
import { useConsultations } from "services/consultation/hooks";
import AdminSidebar from "components/admin-layout/AdminSidebar";
import ReactHTMLTableToExcel from "components/table/ReactHTMLTableToExcel";
import { TableSkeleton } from "components/TableSkeleton";

const AddConsultationModal = dynamic(
  () => import("components/admin/consultation/AddConsultationModal"),
  { ssr: false }
);
const UpdateConsultationStatusModal = dynamic(
  () => import("components/admin/consultation/UpdateConsultationStatusModal"),
  { ssr: false }
);
const DeleteConsultationModal = dynamic(
  () => import("components/admin/consultation/DeleteConsultationModal"),
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

const AdminConsultation: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [openedAddModal, setOpenedAddModal] = useState(false);
  const [openedUpdateModal, setOpenedUpdateModal] = useState(false);
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<{ id: number; status: number }>();
  const [mode, setMode] = useState<"print" | "action">("action");
  const [querySearch, setQuerySearch] = useState("");

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

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

  const {
    data: consultationsData,
    isSuccess: isSuccessConsultations,
    isLoading: isLoadingConsultions,
  } = useConsultations();

  const consultations =
    consultationsData?.map((consultation) => ({
      id: consultation.id,
      date: consultation.date,
      time: consultation.time,
      status: consultation.status,
      visitor_id: consultation.visitor.id,
      visitor_name: consultation.visitor.name,
      visitor_mobile: consultation.visitor.mobile,
      visitor_institution: consultation.visitor.institution_name,
      visitor_referral: consultation.visitor.referral,
      exhibitor_id: consultation.exhibitor.id,
      exhibitor_company_name: consultation.exhibitor.company_name,
    })) || [];

  const fuse = new Fuse(consultations, {
    keys: [
      "exhibitor_company_name",
      "visitor_name",
      "visitor_mobile",
      "visitor_institution",
      "visitor_referral",
    ],
    includeScore: true,
    isCaseSensitive: false,
  });

  const results = fuse.search(querySearch);
  const consultationResults = querySearch
    ? results.map((result) => result.item)
    : consultations;

  const ths = (
    <tr>
      <th>Date</th>
      <th>Time</th>
      <th>Exhibitor</th>
      <th>Visitor Name</th>
      <th>Visitor Institution</th>
      <th>Visitor Contact</th>
      <th>Visitor Referral</th>
      <th>Status</th>
      {mode === "action" && <th>Action</th>}
    </tr>
  );

  const rows = isLoadingConsultions ? (
    <TableSkeleton rows={3} cols={9} />
  ) : (
    consultationResults?.map((consultation) => (
      <tr key={consultation.id}>
        <td>{consultation.date}</td>
        <td>{consultation.time}</td>
        <td style={{ maxWidth: 250 }}>{consultation.exhibitor_company_name}</td>
        <td style={{ maxWidth: 250 }}>{consultation.visitor_name}</td>
        <td style={{ maxWidth: 250 }}>{consultation.visitor_institution}</td>
        <td>{consultation.visitor_mobile}</td>
        <td>{consultation.visitor_referral}</td>
        <td>
          <Badge
            variant="filled"
            size="sm"
            color={
              consultation.status === 1
                ? "gray"
                : consultation.status === 2
                ? "blue"
                : consultation.status === 3
                ? "green"
                : consultation.status === 4
                ? "red"
                : "gray"
            }
          >
            {consultation.status === 1
              ? "Upcoming"
              : consultation.status === 2
              ? "Join Zoom"
              : consultation.status === 3
              ? "Done"
              : consultation.status === 4
              ? "Timeout"
              : ""}
          </Badge>
        </td>
        {mode === "action" && (
          <td>
            <Group>
              <ActionIcon
                onClick={() => {
                  setSelectedConsultation({
                    id: consultation.id,
                    status: consultation.status,
                  });
                  setOpenedUpdateModal(true);
                }}
                variant="light"
                color="blue"
              >
                <Edit size={20} />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  setSelectedConsultation({
                    id: consultation.id,
                    status: consultation.status,
                  });
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
        <Button onClick={() => setOpenedAddModal(true)}>
          Add Consultation
        </Button>
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
          Consultation
        </Title>
        <AddConsultationModal
          opened={openedAddModal}
          setOpened={setOpenedAddModal}
        />
        <UpdateConsultationStatusModal
          selectedConsultation={selectedConsultation}
          opened={openedUpdateModal}
          setOpened={setOpenedUpdateModal}
        />
        <DeleteConsultationModal
          selectedConsultation={selectedConsultation}
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

export default AdminConsultation;
