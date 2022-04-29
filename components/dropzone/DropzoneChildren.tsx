import { Group, MantineTheme, Text } from "@mantine/core";
import { DropzoneStatus } from "@mantine/dropzone";
import { Icon as TablerIcon, Upload, X, Photo } from "tabler-icons-react";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}

type Props = {
  status: DropzoneStatus;
  theme: MantineTheme;
};

export default function DropzoneChildren({ status, theme }: Props) {
  return (
    <Group
      position="center"
      spacing="xs"
      style={{ minHeight: 80, pointerEvents: "none" }}
    >
      <ImageUploadIcon
        status={status}
        style={{ color: getIconColor(status, theme) }}
        size={30}
      />

      <div>
        <Text inline align="center">
          Drag images here or click to select files
        </Text>
        <Text size="sm" color="dimmed" align="center" inline mt={7}>
          Attach as many files as you like, each file should not exceed 5mb
        </Text>
      </div>
    </Group>
  );
}
