import { Dispatch, SetStateAction } from "react";
import { Center, Modal, Title } from "@mantine/core";
import ReactPlayer from "react-player";
import { Exhibitor } from "services/exhibitor/hooks";

type Props = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  exhibitor: Exhibitor | undefined;
};

const VideoModal = ({ opened, setOpened, exhibitor }: Props) => {
  return (
    <Modal
      centered
      opened={opened}
      onClose={() => setOpened(false)}
      size="80vw"
      withCloseButton={false}
      padding={0}
      styles={{ inner: { padding: 0 } }}
    >
      {exhibitor?.company_video_url ? (
        <ReactPlayer
          playing={opened}
          loop
          controls
          width={"100%"}
          height={"calc(80vw * 9/16)"}
          url={exhibitor?.company_video_url}
        />
      ) : (
        <Center
          style={{ height: "calc(80vw * 9/16)", fontWeight: 600, fontSize: 32 }}
        >
          No Video
        </Center>
      )}
    </Modal>
  );
};

export default VideoModal;
