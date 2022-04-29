import { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Center,
  Group,
  Image,
  List,
  Modal,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Exhibitor } from "services/exhibitor/hooks";
import { getFileUrl } from "utils/file-storage";
import { Building, Download, Mail, Phone, World } from "tabler-icons-react";

type Props = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  exhibitor: Exhibitor | undefined;
};

const AboutUsModal = ({ opened, setOpened, exhibitor }: Props) => {
  const theme = useMantineTheme();

  const nameCard = exhibitor?.banners?.find((banner) => banner.order === 11);
  const catalog = exhibitor?.banners?.find((banner) => banner.order === 12);

  return (
    <Modal
      centered
      size="md"
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={3}>Company Info</Title>}
    >
      <Center>
        <Box style={{ width: "40%", marginLeft: -15 }}>
          <Image
            src={
              exhibitor?.company_logo
                ? getFileUrl(exhibitor?.company_logo, "companies")
                : "/hef-2022/logoipsum.svg"
            }
            alt="Logo"
          />
        </Box>
      </Center>
      <List mt="xl" spacing="sm">
        <List.Item
          icon={
            <ThemeIcon color="teal" size={32} radius="xl">
              <Building size={20} />
            </ThemeIcon>
          }
          style={{ fontSize: theme.fontSizes.lg * 0.9 }}
        >
          {exhibitor?.company_name}
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="teal" size={32} radius="xl">
              <World size={20} />
            </ThemeIcon>
          }
          style={{ fontSize: theme.fontSizes.lg * 0.9 }}
        >
          {exhibitor?.company_website}
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="teal" size={32} radius="xl">
              <Mail size={20} />
            </ThemeIcon>
          }
          style={{ fontSize: theme.fontSizes.lg * 0.9 }}
        >
          {exhibitor?.email}
        </List.Item>
        <List.Item
          icon={
            <ThemeIcon color="teal" size={32} radius="xl">
              <Phone size={20} />
            </ThemeIcon>
          }
          style={{ fontSize: theme.fontSizes.lg * 0.9 }}
        >
          {exhibitor?.mobile}
        </List.Item>
      </List>
      <SimpleGrid cols={2}>
        <div>
          <Text mt="lg" mb="sm" align="center" weight={500}>
            Name Card
          </Text>
          {!!nameCard?.image ? (
            <>
              <a
                download
                target="_blank"
                rel="noopener noreferrer"
                href={
                  nameCard?.image ? getFileUrl(nameCard?.image, "banner") : ""
                }
              >
                <Image
                  src={
                    nameCard?.image
                      ? getFileUrl(nameCard?.image, "banner")
                      : "/hef-2022/logoipsum.svg"
                  }
                  alt="Name card"
                  height={200}
                  fit="contain"
                />
              </a>
              <Group position="center">
                <Button
                  component="a"
                  pl="xs"
                  size="xs"
                  mt="md"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<Download size={16} />}
                  href={
                    nameCard?.image ? getFileUrl(nameCard?.image, "banner") : ""
                  }
                >
                  Download Name Card
                </Button>
              </Group>
            </>
          ) : (
            <Center
              style={{
                height: 120,
                borderWidth: "2px",
                border: "1px solid #ddd",
              }}
            >
              <Text size="xl" weight={600}>
                Empty
              </Text>
            </Center>
          )}
        </div>
        <div>
          <Text mt="lg" mb="sm" align="center" weight={500}>
            Catalog
          </Text>
          {catalog ? (
            <div>
              <Group position="center">
                <Button
                  component="a"
                  href={getFileUrl(catalog.image, "banner")}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<Download size={16} />}
                  pl="xs"
                  size="xs"
                  mt="md"
                >
                  Download Catalog
                </Button>
              </Group>
            </div>
          ) : (
            <Center
              style={{
                height: 120,
                borderWidth: "2px",
                border: "1px solid #ddd",
              }}
            >
              <Text size="xl" weight={600}>
                Empty
              </Text>
            </Center>
          )}
        </div>
      </SimpleGrid>
    </Modal>
  );
};

export default AboutUsModal;
