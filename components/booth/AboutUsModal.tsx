import { Dispatch, SetStateAction, useState } from "react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  List,
  Modal,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Exhibitor } from "services/exhibitor/hooks";
import { getFileUrl } from "utils/file-storage";
import { Building, Download, Mail, Phone, World } from "tabler-icons-react";
import fileDownload from "js-file-download";

type Props = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  exhibitor: Exhibitor | undefined;
};

const AboutUsModal = ({ opened, setOpened, exhibitor }: Props) => {
  const theme = useMantineTheme();
  const [showNameCard, setShowNameCard] = useState(false);

  const nameCard = exhibitor?.banners?.find((banner) => banner.order === 11);
  const catalog = exhibitor?.banners?.find((banner) => banner.order === 12);

  // const handleDownloadClick = (url: string, filename: string) => {
  //   console.log({ url });
  //   fetch(url, {
  //     headers: {
  //       Origin: location.origin,
  //     },
  //     mode: "cors",
  //   })
  //     .then((res) => {
  //       console.log({ res });
  //       return res.blob();
  //     })
  //     .then((blob) => {
  //       console.log(blob);
  //       fileDownload(blob, filename);
  //     });
  // };

  return (
    <Modal
      centered
      size="xl"
      opened={opened}
      onClose={() => {
        setShowNameCard(false);
        setOpened(false);
      }}
      title={<Title order={3}>Company Info</Title>}
    >
      {showNameCard ? (
        <Box>
          <Group align="center" position="apart">
            <Button
              pl={4}
              pr={8}
              variant="subtle"
              onClick={() => setShowNameCard(false)}
              radius="sm"
            >
              &larr;{" "}
              <Text component="span" ml="xs" size="sm">
                Back
              </Text>
            </Button>
            <Group position="center">
              <Button
                pl="xs"
                component="a"
                download
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<Download size={16} />}
                href={
                  nameCard?.image ? getFileUrl(nameCard?.image, "banner") : ""
                }
                // onClick={() =>
                //   nameCard?.image &&
                //   handleDownloadClick(
                //     getFileUrl(nameCard?.image, "banner"),
                //     "Name card"
                //   )
                // }
              >
                Download Name Card
              </Button>
            </Group>
          </Group>
          <Paper mt="xs" withBorder>
            <Image
              py="xl"
              src={
                nameCard?.image
                  ? getFileUrl(nameCard?.image, "banner")
                  : "/hef-2022/logoipsum.svg"
              }
              alt="Name card"
              // height={200}
              fit="contain"
            />
          </Paper>
        </Box>
      ) : (
        <Box p="lg">
          <Center mb={40}>
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
          <List mt="xl" mb={40}>
            <SimpleGrid cols={2} spacing="sm">
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
                <Anchor
                  size="sm"
                  href={exhibitor?.company_website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {exhibitor?.company_website}
                </Anchor>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="teal" size={32} radius="xl">
                    <Mail size={20} />
                  </ThemeIcon>
                }
                style={{ fontSize: theme.fontSizes.lg * 0.9 }}
              >
                {/* {exhibitor?.email} */}
                <Anchor size="sm" href={`mailto:${exhibitor?.email}`}>
                  {exhibitor?.email}
                </Anchor>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="teal" size={32} radius="xl">
                    <Phone size={20} />
                  </ThemeIcon>
                }
                style={{ fontSize: theme.fontSizes.lg * 0.9 }}
              >
                <Anchor
                  size="sm"
                  href={`https://wa.me/${exhibitor?.mobile?.replace(/^0/, '62')}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {exhibitor?.mobile}
                </Anchor>
                {/* {exhibitor?.mobile} */}
              </List.Item>
            </SimpleGrid>
          </List>
          <SimpleGrid mt="xl" cols={2}>
            <Paper p="md" radius="md" shadow="xs" withBorder>
              <Text mb="sm" align="center" weight={500}>
                Name Card
              </Text>
              {!!nameCard?.image ? (
                <>
                  <a
                    // download
                    // target="_blank"
                    // rel="noopener noreferrer"
                    // href={
                    //   nameCard?.image
                    //     ? getFileUrl(nameCard?.image, "banner")
                    //     : ""
                    // }
                    onClick={(e) => {
                      e.preventDefault();
                      setShowNameCard(true);
                    }}
                    style={{ cursor: "pointer" }}
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
                        nameCard?.image
                          ? getFileUrl(nameCard?.image, "banner")
                          : ""
                      }
                    >
                      Download Name Card
                    </Button>
                  </Group>
                </>
              ) : (
                <Center
                  style={{
                    height: "90%",
                    // borderWidth: "2px",
                    // border: "1px solid #ddd",
                  }}
                >
                  <Text size="xl" weight={600}>
                    Empty
                  </Text>
                </Center>
              )}
            </Paper>
            <Paper p="md" radius="md" shadow="xs" withBorder>
              <Text mb="sm" align="center" weight={500}>
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
                    height: "90%",

                    // borderWidth: "2px",
                    // border: "1px solid #ddd",
                  }}
                >
                  <Text size="xl" weight={600}>
                    Empty
                  </Text>
                </Center>
              )}
            </Paper>
          </SimpleGrid>
        </Box>
      )}
    </Modal>
  );
};

export default AboutUsModal;
