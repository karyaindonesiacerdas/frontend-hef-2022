import {
  SimpleGrid,
  Text,
  Container,
  Box,
  createStyles,
  Title,
  Card,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import { IBlog } from "types/blog";

const useStyles = createStyles((theme, _params, getRef) => {
  const image = getRef("image");

  return {
    root: {
      marginTop: theme.spacing.xl * 5,
      marginBottom: theme.spacing.xl * 5,
      [theme.fn.smallerThan("sm")]: {
        marginTop: theme.spacing.xl * 3,
        marginBottom: theme.spacing.xl * 3,
      },
    },

    tag: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 700,
      color: theme.colors[theme.primaryColor],
      textTransform: "uppercase",
      textAlign: "center",
    },

    heading: {
      fontSize: theme.fontSizes.xl * 1.5,
      marginBottom: theme.spacing.xl * 2,
      fontWeight: 700,
      textAlign: "center",
    },

    linkText: {
      fontWeight: 500,
    },

    card: {
      position: "relative",
      height: 340,
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],

      [`&:hover .${image}`]: {
        transform: "scale(1.03)",
      },
    },

    image: {
      ref: image,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: "cover",
      transition: "transform 500ms ease",
    },

    overlay: {
      position: "absolute",
      top: "20%",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .85) 90%)",
    },

    content: {
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      zIndex: 1,
    },

    title: {
      color: theme.white,
      marginBottom: 5,
    },

    subtitle: {
      color: theme.white,
      opacity: 0.7,
      fontWeight: 700,
      textTransform: "uppercase",
    },
  };
});

type Props = {
  blogs: IBlog[];
};

export const Blog = ({ blogs }: Props) => {
  const { classes } = useStyles();
  const { t } = useTranslation("home");
  const theme = useMantineTheme();

  return (
    <Box className={classes.root}>
      <Container size="xl">
        <Text className={classes.tag}>{t("blog.header")}</Text>
        <Title order={3} className={classes.heading}>
          {t("blog.subheader")}
        </Title>
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: theme.breakpoints.xs, cols: 1 },
            { maxWidth: theme.breakpoints.sm, cols: 2 },
            { maxWidth: theme.breakpoints.lg, cols: 3 },
          ]}
        >
          {blogs?.map((blog) => (
            <Card
              key={blog._id}
              p="lg"
              shadow="lg"
              className={classes.card}
              radius="md"
              component="a"
              href={blog._id}
              target="_blank"
            >
              <div
                className={classes.image}
                style={{ backgroundImage: `url(${blog.image.src})` }}
              />
              <div className={classes.overlay} />

              <div className={classes.content}>
                <div>
                  <Text size="xl" className={classes.title} weight={500}>
                    {blog.title}
                  </Text>
                  <Text size="xl" className={classes.title} weight={300}>
                    {blog.subtitle}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
