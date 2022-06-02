import React, { useState } from "react";
import {
  createStyles,
  UnstyledButton,
  Menu,
  Image,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { ChevronDown, Language } from "tabler-icons-react";
import images from "./images";
import { useRouter } from "next/router";
import { useMediaQuery } from "@mantine/hooks";

const data = [
  { label: "English", value: "en", image: images.english },
  { label: "Indonesia", value: "id", image: images.indonesia },
];

const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
  control: {
    width: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[2]
    }`,
    transition: "background-color 150ms ease",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[opened ? 5 : 6]
        : opened
        ? theme.colors.gray[0]
        : theme.white,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
    [theme.fn.largerThan("sm")]: {
      width: 180,
    },
  },

  label: {
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },

  icon: {
    transition: "transform 150ms ease",
    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
  },
}));

export function LanguagePicker() {
  const { asPath, locale, push } = useRouter();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles({ opened });
  const theme = useMantineTheme();
  const largerThanSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  const [selected, setSelected] = useState(
    data.find((item) => item.value === locale) || data[0]
  );

  const items = data.map((item) => (
    <Menu.Item
      icon={
        <Image src={item.image} width={18} height={18} alt={selected.label} />
      }
      onClick={() => {
        setSelected(item);
        push(asPath, asPath, { locale: item.value });
      }}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      ml="sm"
      transition="pop"
      transitionDuration={150}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      size={largerThanSm ? "md" : "xs"}
      control={
        <UnstyledButton className={classes.control}>
          <Language size={20} color="gray" />
          <Group spacing="xs">
            <Image
              src={selected.image}
              width={22}
              height={22}
              alt={selected.label}
            />
            {largerThanSm ? (
              <span className={classes.label}>{selected.label}</span>
            ) : null}
          </Group>
          <ChevronDown size={16} className={classes.icon} />
        </UnstyledButton>
      }
    >
      {items}
    </Menu>
  );
}
