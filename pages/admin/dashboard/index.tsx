import { useEffect, useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  AppShell,
  Box,
  Container,
  SimpleGrid,
  Title,
} from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { StatsGrid } from "components/admin/analytics/StatsGrid";
import { usePageCounters } from "services/counter/hook";
import { useTotalVisitorByRegistrationMethod } from "services/admin/useTotalVisitorByRegistrationMethod";
import { useBoothVisitors, useWebinarAttendees } from "services/counter-booth/hooks";

const VisitorDistribution = dynamic(
  () => import("components/admin/analytics/VisitorDistribution"),
  {
    ssr: false,
  }
);

const VisitorDemographic = dynamic(
  () => import("components/admin/analytics/VisitorDemographic"),
  {
    ssr: false,
  }
);

const AdminDashboard: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { data: webinarAttendees } = useWebinarAttendees();
  const { data: boothVisitors } = useBoothVisitors(true);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const { data: pageCounters } = usePageCounters();
  const { data: totalVisitorByRegistration } =
    useTotalVisitorByRegistrationMethod();
  const registeredVisitors = [
    {
      label: "Full Form",
      value: totalVisitorByRegistration?.total_full_registration || 0,
    },
    {
      label: "By Phone",
      value: totalVisitorByRegistration?.total_phone_registration || 0,
    },
  ];

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
        <Title order={2} px={3} style={{ marginBottom: 20 }}>
          Dashboard
        </Title>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "lg", cols: 1 }]}>
          <Box>
            <Title
              px={3}
              mb={-8}
              sx={(theme) => ({ fontSize: theme.fontSizes.xl })}
            >
              Total Registered Visitor
            </Title>
            <StatsGrid
              data={
                registeredVisitors?.map((r) => ({
                  title: r.label,

                  value: String(r.value) || "0",
                  icon: "visitor",
                })) || []
              }
              columns={2}
            />
          </Box>
          <Box>
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
              columns={2}
            />
          </Box>
        </SimpleGrid>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "lg", cols: 1 }]}>
          <Box>
            <Title
              px={3}
              mb={-8}
              sx={(theme) => ({ fontSize: theme.fontSizes.xl })}
            >
              Webinar Attendees
            </Title>
            <StatsGrid
              data={[
                {
                  title: "Attended All",
                  value: String(webinarAttendees?.at(1)?.total_attendees.surveyed || 0),
                  icon: "visitor",
                },
                {
                  title: "At Least One Webinar",
                  value: String(webinarAttendees?.at(0)?.total_attendees.surveyed || 0),
                  icon: "uniqueVisitor",
                }
              ]}
              columns={2}
            />
          </Box>
          <Box>
            <Title
              px={3}
              mb={-8}
              sx={(theme) => ({ fontSize: theme.fontSizes.xl })}
            >
              Booth Visitors
            </Title>
            <StatsGrid
              data={[
                {
                  title: "Visited All",
                  value: String(boothVisitors?.at(1)?.total_visitors || 0),
                  icon: "exhibitor",
                },
                {
                  title: "At Least One Booth",
                  value: String(boothVisitors?.at(0)?.total_visitors || 0),
                  icon: "consultation",
                },
              ]}
              columns={2}
            />
          </Box>
        </SimpleGrid>
        <VisitorDemographic />
        <VisitorDistribution />
      </Container>
    </AppShell>
  );
};

export default AdminDashboard;
