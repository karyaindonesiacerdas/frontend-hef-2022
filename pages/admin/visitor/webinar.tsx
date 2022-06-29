import type { NextPage } from "next";
import { AppShell, Container, Title } from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { WebinarAttendees } from "components/admin/visitor/WebinarAttendees";
import { useWebinarAttendees } from "services/counter-booth/hooks";

const WebinarAttendeesSummary: NextPage = () => {
  const { data: webinarAttendees, isSuccess } = useWebinarAttendees();

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
          Webinar Attendees
        </Title>
        {isSuccess && webinarAttendees && (
          <WebinarAttendees
            data={webinarAttendees
              ?.filter((s) => parseInt(s.id) > 0 && s.total_attendees?.surveyed > 0)
              ?.sort((a, b) => a.order - b.order)}
          />
        )}
      </Container>
    </AppShell>
  );
};

export default WebinarAttendeesSummary;
