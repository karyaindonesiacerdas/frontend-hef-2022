/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  Stack,
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
    label: "Meteorite",
    value: "Meteorite",
  },

  {
    image: "/mars.png",
    label: "Satellite",
    value: "Satellite",
  },
  {
    image: "/venus.png",
    label: "Planet",
    value: "Planet",
  },
  {
    image: "/uranus.png",
    label: "Star",
    value: "Star",
  },
  {
    image: "/jupiter.png",
    label: "Galaxy",
    value: "Galaxy",
  },
];

const schema = z.object({
  exhibitor_type: z
    .string({ invalid_type_error: "Required" })
    .nonempty({ message: "Required" }),
  position: z.number().min(0).max(24),
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
    position: number;
    exhibitor_type: string | null;
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
      exhibitor_type: String(selectedExhibitor?.exhibitor_type),
      position: selectedExhibitor?.position || 0,
    },
  });
  const { setValues } = form;

  useEffect(() => {
    setValues({
      exhibitor_type: String(selectedExhibitor?.exhibitor_type),
      position: selectedExhibitor?.position || 0,
    });
  }, [
    selectedExhibitor?.exhibitor_type,
    selectedExhibitor?.position,
    setValues,
  ]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!selectedExhibitor) return;

    const payload: UpdatePackagePayload = {
      exhibitor_type: values.exhibitor_type,
      user_id: selectedExhibitor?.id,
      position: values.position,
      role: "exhibitor",
    };

    console.log({ payload });

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
        <Stack>
          <TextInput
            readOnly
            label="Company"
            value={selectedExhibitor?.company}
          />
          <Select
            required
            clearable
            label="Choose package"
            placeholder="Pick one"
            // itemComponent={SelectItem}
            data={packages}
            searchable
            nothingFound="Nobody here"
            {...form.getInputProps("exhibitor_type")}
          />
          <NumberInput
            required
            label="Position"
            min={0}
            max={24}
            {...form.getInputProps("position")}
          />
        </Stack>
        <Button type="submit" fullWidth mt="md">
          Update Package
        </Button>
      </form>
    </Modal>
  );
};

// interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
//   image: string;
//   label: string;
// }

// const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
//   ({ image, label, ...others }: ItemProps, ref) => (
//     <div ref={ref} {...others}>
//       <Group noWrap>
//         <Avatar src={image} />

//         <div>
//           <Text size="sm">{label}</Text>
//         </div>
//       </Group>
//     </div>
//   )
// );
