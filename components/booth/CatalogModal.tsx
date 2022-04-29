/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";
import {
  Image,
  Modal,
  SimpleGrid,
  Box,
  Text,
  useMantineTheme,
  Tabs,
  Center,
  Title,
  ScrollArea,
  Group,
  Anchor,
  Button,
} from "@mantine/core";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getFileUrl } from "utils/file-storage";
import { Download } from "tabler-icons-react";

type Props = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  posters: {
    id: number;
    exhibitor_id: number;
    display_name: string;
    description: string;
    image: string;
    order: number;
    type: string | null;
  }[];
  catalog?: {
    id: number;
    exhibitor_id: number;
    display_name: string;
    description: string;
    image: string;
    order: number;
    type: string | null;
  };
};

const CatalogModal = ({ opened, setOpened, posters, catalog }: Props) => {
  const theme = useMantineTheme();

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => setOpened(false)}
      size="xl"
      withCloseButton={false}
      styles={{
        inner: { padding: 0 },
        modal: { maxHeight: "95vh", overflow: "hidden" },
      }}
    >
      <Group px="xs" position="apart" mb="lg" style={{ width: "100%" }}>
        <Text weight={700} size="xl">
          Poster
        </Text>
      </Group>
      <Carousel
        useKeyboardArrows={true}
        showStatus={false}
        showArrows={false}
        showIndicators={false}
        dynamicHeight={false}
      >
        {posters?.map((poster) => (
          <div key={poster.id} style={{ height: "63vh" }}>
            <img
              src={getFileUrl(poster.image, "banner")}
              alt={poster.display_name}
              style={{ objectFit: "contain", maxHeight: "58vh" }}
            />
            <p className="product" style={{ fontWeight: 600 }}>
              {poster.display_name}
            </p>
          </div>
        ))}
      </Carousel>
    </Modal>
  );
};

export default CatalogModal;
