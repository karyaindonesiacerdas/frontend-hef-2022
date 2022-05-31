import React from "react";
import { Box, Group, Text } from "@mantine/core";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const RunningText = () => {
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
      <Group spacing={150} py={6}>
        <Group>
          <Text weight={500} color="white">
            Welcome to Hospital Engineering Expo 2022
          </Text>
        </Group>
        <Group>
          <Image src="/logo.png" width={30} height={30} alt="Logo" />
          <Text weight={500} color="white">
            Perkumpulan Teknik Perumahsakitan Indonesia
          </Text>
        </Group>
      </Group>
    </Box>
  );
};

export default RunningText;
