import React from "react";
import {
  createStyles,
  Container,
  Group,
  ActionIcon,
  Image,
  Text,
  Anchor,
} from "@mantine/core";
import { BrandTwitter, BrandYoutube, BrandInstagram } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl * 1.5,
    paddingBottom: theme.spacing.xl * 2.5,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export const Footer = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <Group>
          <Image
            width={34}
            height={34}
            style={{ flexShrink: 0 }}
            src="/logo.png"
            alt="Logo HEF"
          />
          <Text size="lg" weight={500} style={{ whiteSpace: "nowrap" }}>
            HEF 2022
          </Text>
        </Group>
        <Text>© 2022 Hospital Engineering Forum. All rights reserved.</Text>
        <Group spacing={10} className={classes.links} position="right" noWrap>
          {/* <ActionIcon size="lg">
            <BrandTwitter size={24} />
          </ActionIcon> */}
          <ActionIcon
            size="lg"
            component="a"
            href="https://www.youtube.com/channel/UCtTYDMMLYGfI8Hq4yA9Y5_Q"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* <Anchor href="https://www.youtube.com/channel/UCtTYDMMLYGfI8Hq4yA9Y5_Q"> */}
            <BrandYoutube size={24} />
            {/* </Anchor> */}
          </ActionIcon>
          {/* <ActionIcon size="lg">
            <BrandInstagram size={24} />
          </ActionIcon> */}
        </Group>
      </Container>
    </div>
  );
};
