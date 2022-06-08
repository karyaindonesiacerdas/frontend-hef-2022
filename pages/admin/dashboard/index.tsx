import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AppShell, Container, Stack, Title } from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { StatsGrid } from "components/admin/analytics/StatsGrid";
import { useGraphAccumulative, useGraphTotal } from "services/tracker/hooks";
import { usePageCounters } from "services/counter/hook";

const StatsGraph = dynamic(
  () => import("components/admin/analytics/StatsGraph"),
  {
    ssr: false,
  }
);

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { data: graphTotal } = useGraphTotal();
  const { data: graphAccumulative } = useGraphAccumulative();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const totalVisitor = graphTotal?.reduce((acc: any, cur: any) => {
    return acc + cur.total;
  }, 0);

  const totalUniqueVisitor = graphAccumulative?.map(
    (statistic: any) => statistic.total
  )[graphAccumulative.length - 1];

  const { data: pageCounters } = usePageCounters();
  console.log({ pageCounters });

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
          Dashboard
        </Title>
        <StatsGrid
          data={[
            {
              title: "Visitor",
              value: totalVisitor,
              icon: "visitor",
              diff: 18,
            },
            {
              title: "Unique Visitor",
              value: totalUniqueVisitor,
              icon: "uniqueVisitor",
              diff: 10,
            },
            {
              title: "Exhibitor",
              value: "21",
              icon: "exhibitor",
              diff: 10,
            },
            {
              title: "Consultation",
              value: "50",
              icon: "consultation",
              diff: 20,
            },
          ]}
        />
        <StatsGraph />
        <Title
          px={3}
          mb={-8}
          sx={(theme) => ({ fontSize: theme.fontSizes.xl })}
        >
          Page Visit Counter
        </Title>
        <StatsGrid
          data={
            pageCounters?.map((p) => ({
              title: p.route,
              value: String(p.totalVisit),
              icon: "visitor",
            })) || []
          }
          columns={6}
        />
      </Container>
    </AppShell>
  );
};

export default AdminDashboard;
