import { Dispatch, SetStateAction, useState } from "react";
import {
  ActionIcon,
  Box,
  Center,
  createStyles,
  Image,
  InputWrapper,
  Skeleton,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { TrashX } from "tabler-icons-react";
import DropzoneChildren from "./DropzoneChildren";

const useStyles = createStyles((theme) => ({
  skeleton: {
    height: 180,
  },
  imageWrapper: { position: "relative", height: 180, overflow: "hidden" },
  image: {
    objectFit: "cover",
    objectPosition: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageAction: {
    background: "#000",
    opacity: 0,
    height: 180,
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

export type ImageType = {
  src: string;
  filename: string;
};

type Props = {
  label?: string;
  required?: boolean;
  image: File | undefined;
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  imageError: string;
  setImageError: Dispatch<SetStateAction<string>>;
  currentImage?: string;
};

const ImageInput = ({
  label = "Image",
  required = true,
  image,
  imageError,
  setImage,
  currentImage,
}: Props) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [loadingImage, setLoadingImage] = useState(false);

  const handleDeleteImage = async () => {
    setImage(undefined);
  };

  return (
    <InputWrapper label={label} required={required} error={imageError}>
      {currentImage && (
        <Image
          my="xs"
          fit="contain"
          height={150}
          src={currentImage}
          alt="image Preview"
        />
      )}
      {loadingImage ? (
        <Skeleton mb="sm" className={classes.skeleton} />
      ) : image ? (
        <Box mb="sm" className={classes.imageWrapper}>
          <div className={classes.image}>
            <Image
              fit="contain"
              height={150}
              src={URL.createObjectURL(image)}
              alt="image Preview"
            />
          </div>
          <Center className={classes.imageAction}>
            <ActionIcon
              color="red"
              p="sm"
              size={60}
              onClick={handleDeleteImage}
            >
              <TrashX size={60} />
            </ActionIcon>
          </Center>
        </Box>
      ) : (
        <Dropzone
          mb="sm"
          onDrop={async (files) => {
            setImage(files[0]);
          }}
          onReject={(files) => setImage(undefined)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          {/* {(status) => dropzoneChildren(status, theme)} */}
          {(status) => <DropzoneChildren status={status} theme={theme} />}
        </Dropzone>
      )}
    </InputWrapper>
  );
};

export default ImageInput;
