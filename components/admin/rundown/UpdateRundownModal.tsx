import { useEffect, useState } from "react";
import {
  Button,
  LoadingOverlay,
  Modal,
  Select,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";

import { UpdateRundownPayload, updateRundown } from "services/rundown";
import { DatePicker, TimeInput, TimeRangeInput } from "@mantine/dates";
import dayjs from "dayjs";

const schema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string(),
  speakers: z.string().nonempty(),
  position: z.string(),
  date: z.date({
    required_error: "Required",
    invalid_type_error: "Required",
  }),
  start_time: z.date({
    required_error: "Required",
    invalid_type_error: "Required",
  }),
  end_time: z.date({
    required_error: "Required",
    invalid_type_error: "Required",
  }),
  status: z.string().nonempty(),
  embedd_link: z.string(),
  attachment_link: z.string(),
});

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

type UpdateRundownModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRundown?: Rundown;
};

export const UpdateRundownModal = ({
  opened,
  setOpened,
  selectedRundown,
}: UpdateRundownModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      title: "",
      subtitle: "",
      speakers: "",
      position: "",
      date: new Date(),
      start_time: new Date(),
      end_time: new Date(),
      status: "",
      embedd_link: "",
      attachment_link: "",
    },
  });
  const { setValues } = form;

  useEffect(() => {
    const time = selectedRundown?.time?.split(" - ");
    setValues({
      title: selectedRundown?.title || "",
      subtitle: selectedRundown?.subtitle || "",
      speakers: selectedRundown?.speakers || "",
      position: selectedRundown?.position || "",
      date: selectedRundown?.date
        ? new Date(selectedRundown?.date)
        : new Date(),
      attachment_link: selectedRundown?.attachment_link || "",
      embedd_link: selectedRundown?.embedd_link || "",
      status: String(selectedRundown?.status),
      start_time: new Date(
        dayjs(selectedRundown?.date)
          .set("h", Number(time ? time[0].split(".")[0] : 0))
          .set("m", Number(time ? time[0].split(".")[1] : 0))
          .format()
      ),
      end_time: new Date(
        dayjs(selectedRundown?.date)
          .set("h", Number(time ? time[1].split(".")[0] : 0))
          .set("m", Number(time ? time[1].split(".")[1] : 0))
          .format()
      ),
    });
  }, [selectedRundown, setValues]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedRundown) return;

    const { start_time, end_time, date, status, ...others } = values;

    const payload: UpdateRundownPayload = {
      ...others,
      status: Number(status),
      date: dayjs(values.date).format("YYYY-MM-DD"),
      time: `${dayjs(values.start_time).format("HH.mm")} - ${dayjs(
        values.end_time
      ).format("HH.mm")}`,
    };

    setVisible(true);
    try {
      await updateRundown(selectedRundown.id, payload);
      await queryClient.invalidateQueries("rundowns");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Rundown updated!",
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
        form.clearErrors();
        setOpened(false);
      }}
      title="Update Rundown"
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
        <TextInput
          required
          label="Title"
          mb="sm"
          {...form.getInputProps("title")}
        />

        <TextInput
          label="Subtitle"
          mb="sm"
          {...form.getInputProps("subtitle")}
        />

        <TextInput
          label="Speaker"
          mb="sm"
          {...form.getInputProps("speakers")}
        />

        <TextInput
          label="Position"
          mb="sm"
          {...form.getInputProps("position")}
        />

        <DatePicker
          placeholder="Pick date"
          label="Date"
          required
          mb="sm"
          {...form.getInputProps("date")}
        />

        <SimpleGrid cols={2} mb="sm">
          <TimeInput
            required
            clearable
            label="Start Time"
            {...form.getInputProps("start_time")}
          />
          <TimeInput
            required
            clearable
            label="End Time"
            {...form.getInputProps("end_time")}
          />
        </SimpleGrid>

        <Select
          required
          label="Status"
          placeholder="Pick one"
          data={[
            { value: "1", label: "Upcomming" },
            { value: "2", label: "Now Showing" },
            { value: "3", label: "Done" },
          ]}
          mb="sm"
          {...form.getInputProps("status")}
        />

        <TextInput
          label="Video Link"
          mb="sm"
          {...form.getInputProps("embedd_link")}
        />

        <TextInput
          label="Attachment Link (Materials)"
          mb="sm"
          {...form.getInputProps("attachment_link")}
        />

        <Button type="submit" fullWidth mt="md">
          Update Rundown
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateRundownModal;
