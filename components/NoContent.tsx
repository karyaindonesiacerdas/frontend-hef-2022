import { Center, Group, Text, useMantineTheme } from "@mantine/core";
import React, { ReactNode } from "react";
import { Archive } from "tabler-icons-react";

type Props = {
  text?: string;
  action?: ReactNode;
};

const NoContent = ({ text = "No Data", action }: Props) => {
  const theme = useMantineTheme();
  return (
    <Center
      style={{
        height: "40vh",
        border: "dashed",
        borderColor: theme.colors[theme.primaryColor][3],
        borderRadius: 10,
        minHeight: 250,
      }}
    >
      <Group direction="column" align="center">
        <Archive size={50} color={theme.colors[theme.primaryColor][6]} />
        <Text size="xl" weight={700} color="gray">
          {text}
        </Text>
        {action}
      </Group>
    </Center>
  );
};

export default NoContent;
