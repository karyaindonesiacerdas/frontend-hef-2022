import React from "react";
import { Box, Group, Text, useMantineTheme } from "@mantine/core";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { useMediaQuery } from "@mantine/hooks";

const RunningText = () => {
  const theme = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors[theme.primaryColor][6],
        position: "absolute",
        top: 0,
      })}
      component={Marquee}
      speed={50}
      gradientColor={[18, 184, 134]}
      gradientWidth={50}
    >
      <Group spacing={150} py={largerThanSm ? 6 : 4}>
        <Group mr={100}>
          <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
            Welcome to Hospital Engineering Expo 2022
          </Text>
        </Group>
        <Group mr={100}>
          <Image
            src="/logo.png"
            width={largerThanSm ? 30 : 26}
            height={largerThanSm ? 30 : 26}
            alt="Logo"
          />
          <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
            Perkumpulan Teknik Perumahsakitan Indonesia
          </Text>
        </Group>
      </Group>
    </Box>
  );
};

export default RunningText;
