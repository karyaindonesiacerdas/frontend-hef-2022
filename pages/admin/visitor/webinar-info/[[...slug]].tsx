import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  AppShell,
  Container,
  Title,
} from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import KamalReactTable from "components/table/KamalReactTable";
import { useAuth } from "contexts/auth.context";
import { useAttendeesList } from "services/counter-booth/hooks";
import { usePackages } from "services/package/hooks/usePackages";

type KamalReactTableParams = {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  sort?: {
    sortColumn: string,
    sortDirection: string
  }
}

const AdminVisitorInfo: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(1);
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const slug = router.query.slug || []

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const {
    data: visitorViews,
    isSuccess: isSuccessVisitorViews,
    isLoading: isLoadingVisitorViews,
  } = useAttendeesList({ webinarId: slug[0], page: pageIndex, limit: pageSize, filter, sortColumn, sortDirection });
  const { data: packages } = usePackages();

  const data = useMemo(
    () =>
      isSuccessVisitorViews &&
      visitorViews?.data?.map((visitorView, i) => ({
        no: i + visitorViews?.from,
        id: visitorView?.id,
        name: visitorView?.name,
        email: visitorView?.email,
        mobile: visitorView?.mobile,
        province: visitorView?.province,
        institution_name: visitorView?.institution_name,
        referral: visitorView?.referral,
      })),
    [visitorViews, isSuccessVisitorViews]
  );

  const columns = [
    {
      Header: "No",
      Footer: "No",
      accessor: "no",
    },
    {
      Header: "Name",
      Footer: "Name",
      accessor: "name",
    },
    {
      Header: "Email",
      Footer: "Email",
      accessor: "email",
    },
    {
      Header: "Mobile",
      Footer: "Mobile",
      accessor: "mobile",
    },
    {
      Header: "Province",
      Footer: "Province",
      accessor: "province",
    },
    {
      Header: "Institution Name",
      Footer: "Institution Name",
      accessor: "institution_name",
    },
    {
      Header: "Referral",
      Footer: "Referral",
      accessor: "referral",
    },
  ];

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const getTitle = () => {
    let title = 'Webinar Attendees List';
    if (slug[0]) {
      const webinar = packages?.filter(p => String(p.id) === slug[0])[0];
      if (webinar) title = `${title}: ${webinar.name}`;
    }
    return title;
  }

  const handleParamsChange = (params: KamalReactTableParams) => {
    if (params.pageIndex) setPageIndex(params.pageIndex);
    if (params.pageSize) setPageSize(params.pageSize);
    if (params.filter !== undefined) setFilter(params.filter);
    if (params.sort) {
      if (params.sort.sortColumn === '-') {
        setSortColumn('');
        setSortDirection('');
      } else {
        setSortColumn(params.sort.sortColumn);
        setSortDirection(params.sort.sortDirection);
      }
    }
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
          {getTitle()}
        </Title>
        <KamalReactTable
          showFooter={false}
          data={data || []}
          total={visitorViews?.total || 0}
          columns={columns}
          searchable={true}
          pagination={true}
          downloadable={true}
          skeletonCols={8}
          isLoading={isLoadingVisitorViews}
          initialState={{ pageIndex, pageSize }}
          onParamsChange={handleParamsChange}
        />
      </Container>
    </AppShell>
  );
};

export default AdminVisitorInfo;
