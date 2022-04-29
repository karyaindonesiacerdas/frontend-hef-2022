import {
  Anchor,
  Badge,
  createStyles,
  Group,
  Image,
  List,
  ScrollArea,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import React, { useEffect, useRef } from "react";
import { useRundowns } from "services/rundown/hooks";
import { useSettings } from "services/settings/hooks";

const useStyles = createStyles((theme) => ({
  rundownContainer: {
    position: "absolute",
    top: "15%",
    right: "3%",
    maxWidth: "400px",
    width: "100%",
    height: "69vh",
  },
  rundown: {
    maxWidth: "400px",
    width: "100%",
    height: "69vh",
    background: "rgba( 255, 255, 255, 0.8 )",
    // boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    padding: theme.spacing.md,
    position: "fixed",
  },
  listItem: {
    marginBottom: 10,
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  current: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    fontWeight: 500,
    color: "white",
  },
  link: {
    transition: "all",
    transitionDuration: "0.1s",
    "&:hover": {
      transform: "translateY(-3px)",
    },
  },
}));

type Props = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const SeminarRundown = ({ opened, setOpened }: Props) => {
  const { classes, cx } = useStyles();
  const { data: rundowns } = useRundowns();
  const listRef = useRef<HTMLLIElement>(null);
  const { data: settings } = useSettings();

  const todayRundowns = rundowns?.filter(
    (rundown) => rundown.date === "2021-10-02"
  );

  useEffect(() => {
    listRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  });

  return (
    <Transition
      mounted={opened}
      transition="fade"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <div style={styles}>
          <div className={classes.rundownContainer}>
            <div className={classes.rundown}>
              <Title order={3} px="xs" mb="sm">
                Rundown
              </Title>
              <ScrollArea style={{ height: "60vh" }}>
                <List listStyleType="none" spacing="sm">
                  {todayRundowns?.map((rundown, i) => (
                    <li
                      key={rundown.id}
                      ref={rundown.status === 2 ? listRef : null}
                      className={cx(classes.listItem, {
                        [classes.current]: rundown.status === 2,
                      })}
                      value={rundown.status}
                    >
                      {rundown.status === 2 ? (
                        <Group align="center" position="apart">
                          <Text>{rundown.time}</Text>
                          <Badge>Live</Badge>
                        </Group>
                      ) : (
                        <Text>{rundown.time}</Text>
                      )}
                      <Text weight={600}>{rundown.title}</Text>
                      <Text size="sm">{rundown.speakers}</Text>
                      {rundown.status === 2 && (
                        <Group position="right" spacing="md">
                          <Anchor
                            href={settings?.youtube_link}
                            target="_blank"
                            className={classes.link}
                          >
                            <Image
                              src="/hef-2022/youtube.png"
                              alt="Link youtube live"
                              width={30}
                            />
                          </Anchor>
                          <Anchor
                            href={settings?.zoom_link}
                            target="_blank"
                            className={classes.link}
                          >
                            <Image
                              src="/hef-2022/zoom.png"
                              alt="Link zoom"
                              width={30}
                            />
                          </Anchor>
                        </Group>
                      )}
                    </li>
                  ))}
                </List>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default SeminarRundown;
