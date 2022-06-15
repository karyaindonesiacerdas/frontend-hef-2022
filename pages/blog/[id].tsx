import {
  // GetStaticPaths,
  // GetStaticPathsContext,
  GetStaticPropsContext,
  NextPage,
} from "next";

import WebLayout from "components/web-layout/WebLayout";
import {
  // Box,
  // Center,
  Container,
  createStyles,
  Image,
  Text,
  Title,
  TypographyStylesProvider,
  // useMantineTheme,
} from "@mantine/core";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { useTranslation } from "next-i18next";
import { getBlogById } from "services/blog";
import { formatDate } from "utils/date";

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: theme.spacing.xl * 3,
    marginBottom: theme.spacing.xl * 3,
  },
  tag: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    color: theme.colors[theme.primaryColor],
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    fontSize: theme.fontSizes.xl * 2,
    marginBottom: theme.spacing.xl * 2,
    fontWeight: 700,
    textAlign: "center",
    [theme.fn.smallerThan("lg")]: {
      fontSize: theme.fontSizes.xl * 1.5,
    },
  },
  // container: {
  //   gap: theme.spacing.xl * 3,
  // },
  paragraph: {
    lineHeight: 2.2,
    width: "50%",
    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
  },
  imageRight: {
    borderRadius: 6,
    overflow: "hidden",
    transition: "all 1s",
    "&:hover": {
      transform: "rotateY(-15deg) rotateX(5deg)",
    },
    maxWidth: 600,
  },
  container: {
    display: "flex",
    gap: theme.spacing.xl,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    [theme.fn.smallerThan("lg")]: {
      flexDirection: "column-reverse",
    },
  },
  image: {
    width: "50%",
    [theme.fn.smallerThan("lg")]: {
      width: "100%",
    },
  },
}));

type Blog = {
  _id: string;
  image: {
    src: string;
    filename: string;
  };
  title: string;
  subtitle: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const AboutHEF: NextPage = (props: any) => {
  const { classes } = useStyles();
  // const { t } = useTranslation("overview");
  // const theme = useMantineTheme();

  const blog = props?.blog as Blog;

  return (
    <WebLayout>
      <Container className={classes.root}>
        <Title order={1} align="center">
          {blog?.title}
        </Title>
        <Text mt="xs" size="lg" align="center">
          {blog?.subtitle}
        </Text>
        <Text mt="xs" mb="md" size="sm" align="center">
          {blog?.createdAt
            ? formatDate(blog?.createdAt)
            : formatDate(new Date().toISOString())}
        </Text>
        {blog?.image?.src && (
          <Image mt="lg" src={blog?.image.src} alt="Preview" height={300} />
        )}
        <TypographyStylesProvider mt="xl">
          <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
        </TypographyStylesProvider>
      </Container>
    </WebLayout>
  );
};

export default AboutHEF;

export const getStaticPaths = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_API}/blogs/published`
    );
    const blogs = await res.json();
    const paths = blogs?.map((blog: any) => {
      return {
        params: {
          id: blog?._id,
        },
      };
    });
    return {
      paths,
      fallback: true,
    };
  } catch (error) {}
};

export const getStaticProps = async ({
  locale = "en",
  params,
}: GetStaticPropsContext) => {
  const blog = await getBlogById(String(params?.id));
  return {
    props: {
      blog,
      ...(await serverSideTranslations(locale, ["common", "overview"])),
    },
  };
};
