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
import { useUserRewardsList } from "services/activity/hooks";

type KamalReactTableParams = {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  sort?: {
    sortColumn: string,
    sortDirection: string
  }
}

const RewardListPage: NextPage = () => {
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
    data: userRewards,
    isSuccess: isSuccessuserRewards,
    isLoading: isLoadinguserRewards,
  } = useUserRewardsList({ page: pageIndex, limit: pageSize, filter, sortColumn, sortDirection });

  const data = useMemo(
    () =>
      isSuccessuserRewards &&
      userRewards?.data?.map((userReward, i) => ({
        no: i + userRewards?.from,
        id: userReward?.id,
        name: userReward?.name,
        email: userReward?.email,
        mobile: userReward?.mobile,
        rewards: userReward?.rewards,
      })),
    [userRewards, isSuccessuserRewards]
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
      Header: "Total Reward",
      Footer: "Total Reward",
      accessor: "rewards",
    },
  ];

  if (!isInitialized || !isAuthenticated) {
    return null;
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
          Reward
        </Title>
        <KamalReactTable
          showFooter={false}
          data={data || []}
          total={userRewards?.total || 0}
          columns={columns}
          searchable={true}
          pagination={true}
          downloadable={true}
          skeletonCols={5}
          isLoading={isLoadinguserRewards}
          initialState={{ pageIndex, pageSize }}
          onParamsChange={handleParamsChange}
        />
      </Container>
    </AppShell>
  );
};

export default RewardListPage;
