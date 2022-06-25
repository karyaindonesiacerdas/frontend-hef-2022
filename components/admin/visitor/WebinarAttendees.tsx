import React from "react";
import { useRouter } from "next/router";
import { createStyles, Group, Paper, SimpleGrid, Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  value: {
    fontSize: 32,
    fontWeight: 700,
  },

  visitor: {
    fontWeight: 600,
  },

  titleContainer: {
    display: "flex",
    minHeight: 66,
    justifyContent: 'center',
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: 14,
    textAlign: "center",
  },
}));

interface WebinarAttendeesProps {
  data: {
    id: string;
    name: string;
    total_attendees: {
      registered: number;
      surveyed: number;
    }
  }[];
}

export function WebinarAttendees({ data }: WebinarAttendeesProps) {
  const router = useRouter();
  const { classes } = useStyles();

  const handleClick = (id: string) => {
    router.push(`/admin/visitor/webinar-info/${id}`);
  }

  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.name} onClick={() => handleClick(stat.id)} style={{ cursor: 'pointer' }}>
        <Group className={classes.titleContainer}>
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.name}
          </Text>
        </Group>

        <Group direction="column" align="center" spacing={4} mt="xs">
          <Text className={classes.value}>{stat.total_attendees.surveyed}</Text>
          <Text className={classes.visitor}>Attendees</Text>
        </Group>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}
