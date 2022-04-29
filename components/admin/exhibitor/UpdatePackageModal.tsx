/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { updatePackage, UpdatePackagePayload } from "services/auth.service";
import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";

const packages = [
  {
    image: "/mercury.png",
    label: "Mercury",
    value: "1",
  },

  {
    image: "/mars.png",
    label: "Mars",
    value: "2",
  },
  {
    image: "/venus.png",
    label: "Venus",
    value: "3",
  },
  {
    image: "/uranus.png",
    label: "Uranus",
    value: "4",
  },
  {
    image: "/jupiter.png",
    label: "Jupiter",
    value: "5",
  },
];

const schema = z.object({
  package_id: z
    .string({ invalid_type_error: "Required" })
    .nonempty({ message: "Required" }),
});

type UpdatePackageModalProps = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedExhibitor?: {
    id: number;
    name: string;
    company: string;
    package_id: number;
    package_name: string;
  };
};

export const UpdatePackageModal = ({
  opened,
  setOpened,
  selectedExhibitor,
}: UpdatePackageModalProps) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: {
      package_id: String(selectedExhibitor?.package_id),
    },
  });
  const { setValues } = form;

  useEffect(() => {
    setValues({ package_id: String(selectedExhibitor?.package_id) });
  }, [selectedExhibitor?.package_id, setValues]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedExhibitor) return;

    const payload: UpdatePackagePayload = {
      package_id: Number(values.package_id),
      user_id: selectedExhibitor?.id,
    };

    setVisible(true);
    try {
      await updatePackage(payload);
      await queryClient.invalidateQueries("exhibitors");
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
      title="Change Package"
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
          readOnly
          label="Company"
          value={selectedExhibitor?.company}
          mb="sm"
        />
        <Select
          clearable
          label="Choose package"
          placeholder="Pick one"
          itemComponent={SelectItem}
          data={packages}
          searchable
          maxDropdownHeight={400}
          nothingFound="Nobody here"
          filter={(value, item) =>
            !!item?.label?.toLowerCase().includes(value.toLowerCase().trim())
          }
          {...form.getInputProps("package_id")}
        />
        <Button type="submit" fullWidth mt="md">
          Update Package
        </Button>
      </form>
    </Modal>
  );
};

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);
