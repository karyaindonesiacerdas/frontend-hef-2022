import { useState } from "react";
import { Button, Group, LoadingOverlay, Modal, Text } from "@mantine/core";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { deleteRundown } from "services/rundown";

export type Rundown = {
  id: number;
  title: string;
  subtitle: string | null;
  speakers: string;
  position: string | null;
  date: string;
  time: string;
  status: 1 | 2 | 3;
  embedd_link: string | null;
  attachment_link: string | null;
};

type DeleteRundownModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRundown?: Rundown;
};

export const DeleteRundownModal = ({
  opened,
  setOpened,
  selectedRundown,
}: DeleteRundownModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const handleDelete = async () => {
    if (!selectedRundown) return;

    setVisible(true);

    try {
      await deleteRundown(selectedRundown.id);
      await queryClient.invalidateQueries("rundowns");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Rundown deleted!",
        color: "green",
      });
      setOpened(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message,
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
      }}
      title="Delete Rundown"
      styles={(theme) => ({
        header: {
          fontWeight: 700,
        },
        modal: {
          position: "relative",
        },
      })}
    >
      <LoadingOverlay visible={visible} />
      <Text size="sm">Are you sure you want to delete this rundown?</Text>
      <Group mt="lg" position="right">
        <Button variant="outline" color="dark" onClick={() => setOpened(false)}>
          No don&apos;t delete it
        </Button>
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteRundownModal;
