import { useState } from "react";
import { Button, Group, LoadingOverlay, Modal, Text } from "@mantine/core";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { deleteConsultation } from "services/consultation";

type DeleteConsultationModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedConsultation?: {
    id: number;
    status: number;
  };
};

export const DeleteConsultationModal = ({
  opened,
  setOpened,
  selectedConsultation,
}: DeleteConsultationModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const handleDelete = async () => {
    if (!selectedConsultation) return;

    setVisible(true);
    try {
      await deleteConsultation(selectedConsultation.id);
      await queryClient.invalidateQueries("consultations");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Consultation deleted!",
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
      title="Delete Consultation"
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
      <Text size="sm">Are you sure you want to delete this consultation?</Text>
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

export default DeleteConsultationModal;
