/* eslint-disable react/display-name */
import { FormEvent, forwardRef, useState } from "react";
import {
  Avatar,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";

import { checkUserByEmail } from "services/user";
import { useExhibitors } from "services/exhibitor/hooks";
import {
  AddConsultationPayload,
  addConsultation,
} from "services/consultation/consultation";
import { dateSlots, timeSlots } from "./data";
import { useBookedConsultations } from "services/consultation/hooks";

const schema = z.object({
  date: z.string().nonempty(),
  time: z.string().nonempty(),
  exhibitor_id: z.string().nonempty(),
  email: z.string().nonempty(),
  name: z.string().nonempty(),
  mobile: z.string().nonempty(),
  institution_name: z.string().nonempty(),
});

type AddConsultationModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddConsultationModal = ({
  opened,
  setOpened,
}: AddConsultationModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const [searchEmail, setSearchEmail] = useState("");
  const [step, setStep] = useState(1);

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      date: "",
      time: "",
      exhibitor_id: "",
      email: "",
      name: "",
      mobile: "",
      institution_name: "",
    },
  });

  const { data: exhibitors } = useExhibitors({ showAll: false });
  const data =
    exhibitors
      ?.filter(
        (exhibitor) =>
          [3, 4, 5].includes(exhibitor.package_id) ||
          exhibitor?.ala_carte?.includes("open_consultation")
      )
      ?.map((exhibitor) => ({
        image: exhibitor.company_logo
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/companies/${exhibitor.company_logo}`
          : "",
        label: exhibitor.company_name,
        value: String(exhibitor.id),
        description: exhibitor.business_nature?.join(", "),
      })) || [];

  const { data: booked } = useBookedConsultations(
    Number(form.values.exhibitor_id || "0")
  );

  const availableDates = dateSlots
    .filter((slot) => {
      const today = new Date().toISOString().split("T")[0];

      if (today > slot) {
        return false;
      }
      return true;
    })
    .map((slot) => ({
      value: slot,
      label: slot,
    }));

  const availableTimes =
    form.values.date && timeSlots[form.values.date]
      ? timeSlots[form.values.date]
          .filter((slot) => {
            const today = new Date();

            if (today.toISOString().split("T")[0] !== form.values.date) {
              return true;
            }

            if (
              today
                .toLocaleTimeString("en-US", {
                  hour12: false,
                })
                .split(" ")[0] > slot
            ) {
              return false;
            }

            return true;
          })
          .filter((slot) => {
            const found = booked?.find(
              (b) => b.date === form.values.date && b.time === slot
            );
            return !found;
          })
          .map((slot) => ({
            label: slot,
            value: slot,
          }))
      : [];

  const handleSearchEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchEmail) return;
    try {
      const data = await checkUserByEmail(searchEmail);
      form.setValues({
        email: data.email || "",
        institution_name: data.institution_name || "",
        name: data.name || "",
        mobile: data.mobile || "",
        date: "",
        exhibitor_id: "",
        time: "",
      });
      notifications.showNotification({
        title: "Found",
        message: "Email is registered.",
        color: "green",
      });
    } catch (error) {
      form.setValues({
        email: searchEmail,
        institution_name: "",
        name: "",
        mobile: "",
        date: "",
        exhibitor_id: "",
        time: "",
      });
      notifications.showNotification({
        title: "Not Found",
        message: "Email is not registered.",
        color: "blue",
      });
    } finally {
      setStep(2);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    const payload: AddConsultationPayload = {
      ...values,
      exhibitor_id: Number(values.exhibitor_id),
      status: 1,
    };
    setVisible(true);
    try {
      await addConsultation(payload);
      await queryClient.invalidateQueries("consultations");
      setVisible(false);
      notifications.showNotification({
        title: "Success",
        message: "Consultation added!",
        color: "green",
      });
      setOpened(false);
    } catch (error: any) {
      setVisible(false);
      notifications.showNotification({
        title: "Error",
        message: error?.message || "Error add consultation",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setStep(1);
        setSearchEmail("");
        setOpened(false);
      }}
      title="Add Consultation"
      styles={(theme) => ({
        header: {
          fontWeight: 700,
        },
        modal: {
          position: "relative",
        },
      })}
    >
      {step === 1 && (
        <form onSubmit={handleSearchEmail}>
          <TextInput
            required
            label="Search Email"
            mb="sm"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <Button type="submit" fullWidth mt="md">
            Search Email
          </Button>
        </form>
      )}
      {step === 2 && (
        <>
          <LoadingOverlay visible={visible} />
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              required
              label="Email"
              mb="sm"
              readOnly
              {...form.getInputProps("email")}
            />

            <TextInput
              required
              label="Name"
              mb="sm"
              {...form.getInputProps("name")}
            />

            <TextInput
              required
              label="Phone Number"
              mb="sm"
              {...form.getInputProps("mobile")}
            />

            <TextInput
              required
              label="Institution"
              mb="sm"
              {...form.getInputProps("institution_name")}
            />

            <Select
              required
              mb="sm"
              label="Choose Exhibitor"
              placeholder="Pick one"
              itemComponent={SelectItem}
              data={data}
              searchable
              clearable
              maxDropdownHeight={400}
              nothingFound="Nobody here"
              filter={(value, item) =>
                item?.label
                  ?.toLowerCase()
                  ?.includes(value.toLowerCase().trim()) ||
                item?.description
                  ?.toLowerCase()
                  ?.includes(value.toLowerCase().trim())
              }
              {...form.getInputProps("exhibitor_id")}
            />

            {form.values.exhibitor_id ? (
              <SimpleGrid cols={2}>
                <Select
                  required
                  label="Date"
                  mb="sm"
                  nothingFound="No date available"
                  data={availableDates}
                  {...form.getInputProps("date")}
                />

                {form.values.date ? (
                  <Select
                    required
                    label="Time"
                    mb="sm"
                    nothingFound="No time available"
                    data={availableTimes}
                    {...form.getInputProps("time")}
                  />
                ) : null}
              </SimpleGrid>
            ) : null}

            <Button type="submit" fullWidth mt="md">
              Add Consultation
            </Button>
          </form>
        </>
      )}
    </Modal>
  );
};

export default AddConsultationModal;

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} style={{ objectFit: "contain" }} />

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);
