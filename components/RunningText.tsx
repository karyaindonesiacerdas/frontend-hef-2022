import React from "react";
import {
  Box,
  Button,
  Group,
  Text,
  useMantineTheme,
  Image,
} from "@mantine/core";
import Marquee from "react-fast-marquee";
import { useMediaQuery } from "@mantine/hooks";
import { useSettings } from "services/settings/hooks";

const RunningText = ({ showJoinZoom = true }: { showJoinZoom?: boolean }) => {
  const theme = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

  // const { data: settings } = useSettings();

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
        {showJoinZoom ? (
          <Group mr={100}>
            <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
              Join seminar dengan klik tombol berikut
            </Text>
            <Button
              sx={{
                backgroundColor: "#2D8CFF",
                "&:hover": {
                  backgroundColor: "#2D8CFF",
                  opacity: 0.9,
                },
              }}
              component="a"
              href="https://us02web.zoom.us/j/88390108381?pwd=OWdFSEk5RHhrV2wwc2xIUWx0ZHdydz09"
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
            >
              <Group spacing={6}>
                <Image width={20} src="/hef-2022/zoom.png" alt="zoom" />
                <Text size="sm">Join Zoom</Text>
              </Group>
            </Button>
          </Group>
        ) : null}
        <Group mr={100}>
          <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
            Extrana Cable, Quality Cables, Quality Living
          </Text>
        </Group>
      </Group>
    </Box>
  );
};

export default RunningText;
