import type { NextPage } from "next";
import { AppShell, Container, Title } from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { BoothVisitors } from "components/admin/visitor/BoothVisitors";
import { useBoothVisitors } from "services/counter-booth/hooks";

const AdminVisitorBooth: NextPage = () => {
  const { data: boothVisitors, isSuccess } = useBoothVisitors();

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
          Booth Visitors
        </Title>
        {isSuccess && boothVisitors && (
          <BoothVisitors
            data={boothVisitors
              ?.filter((s) => s.total_visitors > 0)
              ?.sort((a, b) => b.total_visitors - a.total_visitors)}
          />
        )}
      </Container>
    </AppShell>
  );
};

export default AdminVisitorBooth;
