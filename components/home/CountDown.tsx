import { useEffect, useState } from "react";
import {
  Group,
  SimpleGrid,
  Text,
  Container,
  Box,
  createStyles,
} from "@mantine/core";
import { useTranslation } from "next-i18next";

const useStyles = createStyles((theme) => ({
  root: {
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl * 2,
  },
  tag: {
    fontSize: theme.fontSizes.xl * 1.2,
    textAlign: "center",
    marginBottom: theme.spacing.xl * 1.5,
    fontWeight: 700,
  },
  count: {
    fontSize: theme.fontSizes.xl * 2,
    fontWeight: 700,
  },
  countLabel: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 600,
  },
}));

const countDate = new Date("Juni 11, 2022 07:30:00").getTime();

export const CountDown = () => {
  const { classes } = useStyles();
  const [dates, setDates] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { t } = useTranslation("home");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const gap = countDate - now;

      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      const d = Math.floor(gap / day);
      const h = Math.floor((gap % day) / hour);
      const m = Math.floor((gap % hour) / minute);
      const s = Math.floor((gap % minute) / second);

      setDates(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(intervalId);
  });

  if (countDate < new Date().getDate()) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Container size="sm">
        <Text className={classes.tag}>{t("countdown.tag")}</Text>
        <SimpleGrid cols={4}>
          <Group direction="column" align="center">
            <Text className={classes.count}>{dates}</Text>
            <Text className={classes.countLabel}>{t("countdown.days")}</Text>
          </Group>
          <Group direction="column" align="center">
            <Text className={classes.count}>{hours}</Text>
            <Text className={classes.countLabel}>{t("countdown.hours")}</Text>
          </Group>
          <Group direction="column" align="center">
            <Text className={classes.count}>{minutes}</Text>
            <Text className={classes.countLabel}>{t("countdown.minutes")}</Text>
          </Group>
          <Group direction="column" align="center">
            <Text className={classes.count}>{seconds}</Text>
            <Text className={classes.countLabel}>{t("countdown.seconds")}</Text>
          </Group>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
