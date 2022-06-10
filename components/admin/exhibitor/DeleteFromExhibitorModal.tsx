import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { updatePackage } from "services/auth.service";

type Props = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  name: string;
};

const DeleteFromExhibitorModal = ({ opened, setOpened, id, name }: Props) => {
  const [confirmText, setConfirmText] = useInputState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const handleRemove = async () => {
    if (!id || !name) return;

    try {
      setLoading(true);
      await updatePackage({
        user_id: id,
        role: "visitor",
        position: 0,
        exhibitor_type: "",
      });
      await queryClient.invalidateQueries("exhibitors");
      setLoading(false);
      notifications.showNotification({
        title: "Success",
        message: "Exhibitor removed!",
        color: "green",
      });
      setConfirmText("");
      setOpened(false);
    } catch (error: any) {
      console.log({ error });
      setLoading(false);
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
      onClose={() => setOpened(false)}
      title={`Remove Exhibitor "${name}"`}
    >
      <Text>Are you sure to remove this user from exhibitor?</Text>
      <Text mt="lg">
        Type <Text component="span" weight={500}>{`"${name}"`}</Text> to confirm
      </Text>
      <TextInput value={confirmText} onChange={setConfirmText} />
      <Group mt="xl" position="right">
        <Button variant="subtle" color="gray">
          Close
        </Button>
        <Button
          color="red"
          disabled={confirmText !== name}
          loading={loading}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteFromExhibitorModal;
