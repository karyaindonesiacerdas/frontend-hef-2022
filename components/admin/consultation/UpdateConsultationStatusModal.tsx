/* eslint-disable react/display-name */
import { useEffect, useState } from "react";
import { Button, LoadingOverlay, Modal, Select } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import {
  updateConsultation,
  UpdateConsultationPayload,
} from "services/consultation";

const schema = z.object({
  status: z.string().nonempty(),
});

type UpdateConsultationStatusModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedConsultation?: {
    id: number;
    status: number;
  };
};

export const UpdateConsultationStatusModal = ({
  opened,
  setOpened,
  selectedConsultation,
}: UpdateConsultationStatusModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      status: String(selectedConsultation?.status),
    },
  });
  const { setValues } = form;

  useEffect(() => {
    setValues({ status: String(selectedConsultation?.status) });
  }, [selectedConsultation?.status, setValues]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedConsultation) return;

    const payload: UpdateConsultationPayload = {
      status: Number(values.status),
    };

    setVisible(true);
    try {
      await updateConsultation(selectedConsultation.id, payload);
      await queryClient.invalidateQueries("consultations");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Package updated!",
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
      onClose={() => setOpened(false)}
      title="Change Status"
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          required
          label="Status"
          placeholder="Pick one"
          data={[
            { value: "1", label: "Upcomming" },
            { value: "2", label: "Join Zoom" },
            { value: "3", label: "Done" },
            { value: "4", label: "Timeout" },
          ]}
          mb="sm"
          {...form.getInputProps("status")}
        />
        <Button type="submit" fullWidth mt="md">
          Update Package
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateConsultationStatusModal;
