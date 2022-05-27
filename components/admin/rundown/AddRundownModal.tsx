import { useState } from "react";
import {
  Button,
  InputWrapper,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";

import { AddRundownPayload, addRundown } from "services/rundown";
import { DatePicker, TimeInput, TimeRangeInput } from "@mantine/dates";
import { useRouter } from "next/router";
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
});

type AddRundownModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddRundownModal = ({
  opened,
  setOpened,
}: AddRundownModalProps) => {
  const router = useRouter();
  const { date } = router.query;
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const [lastRundown, setLastRundown] = useState(false);

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      title: "",
      subtitle: "",
      speakers: "",
      position: "",
      date: date ? new Date(String(date)) : new Date(),
      start_time: null,
      end_time: null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const { start_time, end_time, date, ...others } = values;
    const payload: AddRundownPayload = {
      ...others,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      time: `${dayjs(values.start_time).format("HH.mm")} - ${dayjs(
        values.end_time
      ).format("HH.mm")}`,
      is_end: lastRundown ? 1 : 0,
    };

    setVisible(true);
    try {
      await addRundown(payload);
      await queryClient.invalidateQueries("rundowns");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Rundown added!",
        color: "green",
      });
      form.reset();
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
      title="Add Rundown"
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
          required
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
          required
          placeholder="Pick date"
          label="Date"
          mb="sm"
          {...form.getInputProps("date")}
        />

        <SimpleGrid cols={2}>
          <TimeInput
            required
            clearable
            label="Start Time"
            mb="sm"
            {...form.getInputProps("start_time")}
          />
          <TimeInput
            required
            clearable
            label="End Time"
            mb="sm"
            {...form.getInputProps("end_time")}
          />
        </SimpleGrid>

        <InputWrapper label="Last rundown?">
          <Switch
            aria-label="Last rundown"
            checked={lastRundown}
            onChange={(e) => setLastRundown(e.currentTarget.checked)}
          />
        </InputWrapper>

        <Button type="submit" fullWidth mt="md">
          Add Rundown
        </Button>
      </form>
    </Modal>
  );
};

export default AddRundownModal;
