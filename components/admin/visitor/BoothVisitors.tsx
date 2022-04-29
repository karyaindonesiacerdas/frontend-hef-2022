import React from "react";
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

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: 14,
  },
}));

interface BoothVisitorsProps {
  data: {
    id: string;
    company_name: string;
    total_visitors: number;
  }[];
}

export function BoothVisitors({ data }: BoothVisitorsProps) {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.company_name}>
        <Group position="center">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.company_name}
          </Text>
        </Group>

        <Group direction="column" align="center" spacing={4} mt="xs">
          <Text className={classes.value}>{stat.total_visitors}</Text>
          <Text className={classes.visitor}>Visitors</Text>
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
