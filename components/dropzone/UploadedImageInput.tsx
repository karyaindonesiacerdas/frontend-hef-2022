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
  image?: ImageType;
  setImage: Dispatch<ImageType>;
  currentImage?: string;
};

const UploadedImageInput = ({
  label = "Image",
  required = true,
  image,
  setImage,
}: Props) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/upload`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  };

  const handleDeleteImage = async () => {
    if (!image || !image.src) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/upload`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: image?.filename,
        }),
      });
      await res.json();
      setLoading(false);
      setImage({ src: '', filename: '' });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <InputWrapper label={label} required={required}>
      {loading ? (
        <Skeleton mb="sm" className={classes.skeleton} />
      ) : (image && image.src) ? (
        <Box mb="sm" className={classes.imageWrapper}>
          <div className={classes.image}>
            <Image
              fit="contain"
              height={150}
              src={image.src}
              alt="Preview"
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
            try {
              setLoading(true);
              const result = await uploadImage(files[0]);
              setImage({
                src: result.data.path,
                filename: result.data.filename,
              });
              setLoading(false);
            } catch (error) {
              setLoading(false);
            }
          }}
          onReject={(files) => setImage({ src: '', filename: '' })}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          {(status) => <DropzoneChildren status={status} theme={theme} />}
        </Dropzone>
      )}
    </InputWrapper>
  )
}

export default UploadedImageInput;