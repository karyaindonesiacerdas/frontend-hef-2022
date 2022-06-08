import React from "react";
import { createStyles, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  UserCheck,
  Presentation,
  Video,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  visitor: Users,
  uniqueVisitor: UserCheck,
  exhibitor: Presentation,
  consultation: Video,
};

interface StatsGridProps {
  data: {
    title: string;
    icon: keyof typeof icons;
    value: string;
    diff?: number;
  }[];
  columns?: number;
}

export function StatsGrid({ data, columns = 4 }: StatsGridProps) {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff
      ? stat.diff > 0
        ? ArrowUpRight
        : ArrowDownRight
      : null;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          {stat.diff && (
            <Text
              color={stat.diff > 0 ? "teal" : "red"}
              size="sm"
              weight={500}
              className={classes.diff}
            >
              <span>{stat.diff}%</span>
              {DiffIcon && <DiffIcon size={16} />}
            </Text>
          )}
        </Group>

        {stat.diff && (
          <Text size="xs" color="dimmed" mt={7}>
            Compared to previous day
          </Text>
        )}
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={columns}
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
