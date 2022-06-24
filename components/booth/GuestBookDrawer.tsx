import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Drawer,
  Title,
  useMantineTheme,
} from "@mantine/core";

import KamalReactTable from "components/table/KamalReactTable";
import { useAuth } from "contexts/auth.context";
import { useVisitorViews } from "services/counter-booth/hooks";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import dayjs from 'dayjs'

type Props = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

type KamalReactTableParams = {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  sort?: {
    sortColumn: string,
    sortDirection: string
  }
}

const GuestBookDrawer = ({ opened, setOpened }: Props) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(1);
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('');

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  const {
    data: visitorViews,
    isSuccess: isSuccessVisitorViews,
    isLoading: isLoadingVisitorViews,
  } = useVisitorViews({ page: pageIndex, limit: pageSize, filter, sortColumn, sortDirection });

  const data = useMemo(
    () =>
      isSuccessVisitorViews &&
      visitorViews?.data?.map((visitorView, i) => ({
        no: i + visitorViews?.from,
        id: visitorView?.id,
        name: visitorView?.visitor?.name,
        email: visitorView?.visitor?.email,
        mobile: visitorView?.visitor?.mobile,
        province: visitorView?.visitor?.province,
        institution_name: visitorView?.visitor?.institution_name,
        created_at: dayjs(visitorView?.created_at).format('YYYY-MM-DD HH:mm'),
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
      Header: "Datetime",
      Footer: "Datetime",
      accessor: "created_at",
    },
  ];

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const handleParamsChange = (params: KamalReactTableParams) => {
    if (params.pageIndex) setPageIndex(params.pageIndex);
    if (params.pageSize) setPageSize(params.pageSize);
    if (params.filter) setFilter(params.filter);
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
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={1} style={{ fontSize: theme.fontSizes.xl }}>
          Booth Visitors: {visitorViews?.total}
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
      <KamalReactTable
        showFooter={false}
        data={data || []}
        total={visitorViews?.total || 0}
        columns={columns}
        searchable={true}
        sortable={true}
        pagination={true}
        downloadable={true}
        skeletonCols={8}
        isLoading={isLoadingVisitorViews}
        initialState={{ pageIndex, pageSize }}
        onParamsChange={handleParamsChange}
      />
    </Drawer>
  );
};

export default GuestBookDrawer;