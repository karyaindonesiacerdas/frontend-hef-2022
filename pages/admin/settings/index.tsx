import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AppShell, Badge, Button, Container, Title } from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import ReactTable from "components/table/ReactTable";
import { UpdatePackageModal } from "components/admin/exhibitor/UpdatePackageModal";
import { useAuth } from "contexts/auth.context";
import { useExhibitors } from "services/exhibitor/hooks";

const AdminSettings: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [openedUpdateModal, setOpenedUpdateModal] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<{
    id: number;
    name: string;
    company: string;
    package_id: number;
    package_name: string;
    position: number;
  }>();

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

  const data = useMemo(
    () =>
      isSuccessExhibitors &&
      exhibitors?.map((exhibitor: any) => ({
        id: String(exhibitor.id),
        name: exhibitor.name,
        company: exhibitor.company_name,
        package_id: String(exhibitor?.package?.id),
        package_name: exhibitor?.package?.name,
        ala_carte: exhibitor?.ala_carte,
        position: exhibitor?.position,
      })),
    [exhibitors, isSuccessExhibitors]
  );

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        Footer: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        Footer: "Name",
        accessor: "name",
      },
      {
        Header: "Company",
        Footer: "Company",
        accessor: "company",
      },
      {
        Header: "Package",
        Footer: "Package",
        accessor: "package_name",
        Cell: ({ value }: any) => (
          <Badge
            radius="sm"
            color={
              value === "mercury"
                ? "gray"
                : value === "mars"
                ? "red"
                : value === "venus"
                ? "yellow"
                : value === "uranus"
                ? "blue"
                : value === "jupiter"
                ? "orange"
                : "gray"
            }
            variant={value ? "filled" : "light"}
          >
            {value || "No package"}
          </Badge>
        ),
      },
      {
        Header: "Action",
        Footer: "Action",
        Cell: ({ row }: any) => (
          <Button
            size="xs"
            variant="light"
            onClick={() => {
              setSelectedExhibitor(row.original);
              setOpenedUpdateModal(true);
            }}
          >
            Update Package
          </Button>
        ),
      },
    ],
    []
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
          Settings
        </Title>
        <UpdatePackageModal
          opened={openedUpdateModal}
          setOpened={setOpenedUpdateModal}
          selectedExhibitor={selectedExhibitor}
        />
        <ReactTable
          showFooter={false}
          data={data || []}
          columns={columns}
          searchable={true}
          pagination={true}
          isLoading={isLoadingExhibitors}
        />
      </Container>
    </AppShell>
  );
};

export default AdminSettings;
