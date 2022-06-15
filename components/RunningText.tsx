import React from "react";
import {
  Box,
  Button,
  Group,
  Text,
  useMantineTheme,
  Image,
  Anchor,
} from "@mantine/core";
import Marquee from "react-fast-marquee";
import { useMediaQuery } from "@mantine/hooks";
import {
  BrandFacebook,
  BrandInstagram,
  BrandYoutube,
  World,
} from "tabler-icons-react";

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
          <Image
            src="https://res.cloudinary.com/darwxdfjz/image/upload/v1654869635/HEF-2022/ud0byx0oiqbzelqsn7zf.png"
            width={100}
            height={largerThanSm ? 30 : 26}
            alt="Logo"
          />
          <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
            Extrana Cable, Quality Cables, Quality Living
          </Text>
        </Group>
        <Group mr={100} align="center">
          <Image
            src="https://res.cloudinary.com/darwxdfjz/image/upload/v1654862304/HEF-2022/clh03e7zppl8fvkflk9g.png"
            width={120}
            height={largerThanSm ? 30 : 26}
            alt="Logo"
          />
          <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
            Kunjungin website kami{" "}
          </Text>
          <Anchor
            href="https://www.selaraslawangsewu.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <World color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                www.selaraslawangsewu.com
              </Text>
            </Group>
          </Anchor>
          <Anchor
            href="https://www.instagram.com/selaraslawangsewu_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <BrandInstagram color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                @selaraslawangsewu_official
              </Text>
            </Group>
          </Anchor>
          <Anchor
            href="https://www.youtube.com/channel/UCQf0N0N_IikQTXRvIC5eJIw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <BrandYoutube color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                PT Selaras Lawang Sewu
              </Text>
            </Group>
          </Anchor>
        </Group>
        <Group mr={100} align="center">
          <Image
            src="https://res.cloudinary.com/darwxdfjz/image/upload/v1654872014/HEF-2022/swko7w2hzvf8n8a6wg3f.png"
            width={80}
            height={largerThanSm ? 30 : 26}
            alt="Logo"
          />
          <Text weight={500} color="white" size={largerThanSm ? "md" : "sm"}>
            Kunjungin website kami{" "}
          </Text>
          <Anchor
            href="https://www.dekkson.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <World color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                www.dekkson.com
              </Text>
            </Group>
          </Anchor>
          <Anchor
            href="https://www.instagram.com/Dekkson_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <BrandInstagram color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                @dekkson_official
              </Text>
            </Group>
          </Anchor>
          <Anchor
            href="https://www.youtube.com/c/Dekkson"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <BrandYoutube color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Dekkson
              </Text>
            </Group>
          </Anchor>
          <Anchor
            href="https://id-id.facebook.com/dekkson/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Group align="center" spacing={4}>
              <BrandFacebook color="white" />
              <Text
                size={largerThanSm ? "md" : "sm"}
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Dekkson
              </Text>
            </Group>
          </Anchor>
        </Group>
      </Group>
    </Box>
  );
};

export default RunningText;
