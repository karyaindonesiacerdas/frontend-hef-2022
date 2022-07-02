import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AppShell, Center, Container, Grid, Group, Image, MultiSelect, Paper, Select, Text, Title, createStyles, Button, Textarea } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { useBoothVisitors, useRandomVisitor, Visitor } from "services/counter-booth/hooks";
import { usePackages } from "services/package/hooks/usePackages";
import type { ImageItemType } from "services/settings";
import { useSettings } from "services/settings/hooks";

interface SelProps {
  selBooths?: string[];
  selWebinars?: string[];
}
interface PrizeWinnerType {
  visitor?: Visitor;
  prize?: ImageItemType;
}

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  tempWinner: {
    fontSize: 32,
  },

  winnerContainer: {
    borderBottom: '1px solid #CCC',
    paddingBottom: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },

  value: {
    fontSize: 32,
    fontWeight: 700,
  },

  visitor: {
    fontWeight: 600,
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: 14,
  },
}));

const Randomizer: NextPage = () => {
  const [mode, setMode] = useState('visitor');
  const [selBooths, setSelBooths] = useState(['one']);
  const [selWebinars, setSelWebinars] = useState(['one']);
  const [selReward, setSelReward] = useState('0');
  const [manualCandidates, setManualCandidates] = useState('');
  const [isRandomizing, setRandomizing] = useState(false);
  const [tempWinner, setTempWinner] = useState<Visitor | null>();
  const [wlWinner, setWlWinner] = useState<PrizeWinnerType | null>();
  const [winners, setWinners] = useState<PrizeWinnerType[]>([]);
  const [censored, setCensored] = useState(true);
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { data: booths } = useBoothVisitors();
  const { data: webinars } = usePackages();
  const { data: settings } = useSettings();
  const { classes } = useStyles();
  const notifications = useNotifications();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const {
    data: visitorData,
    isLoading,
  } = useRandomVisitor({ boothIds: selBooths, webinarIds: selWebinars, winners: winners.map(w => w.visitor?.id || 0) });

  const getManualData = () => {
    const list = manualCandidates.split('\n').filter(c => c && !winners.map(w => w.visitor?.name).includes(c));
    const winner = { id: winners.length + 1, name: list[Math.floor(Math.random() * list.length)], mobile: '' };
    return { winner, list, total: list.length };
  }

  const data = mode === 'visitor' ? visitorData : getManualData();

  const boothOpts = useMemo(() => {
    const defaultOpts = [
      { value: 'one', label: '== At least one booth ==' },
      { value: 'all', label: '== All booths ==' },
    ];
    const filtered = booths?.filter(booth => booth.total_visitors > 0) || [];
    const sorted = filtered.sort((a, b) => a.company_name > b.company_name ? 1 : -1);
    return defaultOpts.concat(sorted.map(booth => ({ value: `${booth.id}`, label: booth.company_name })))
  }, [booths]);

  const webinarOpts = useMemo(() => {
    const defaultOpts = [
      { value: 'one', label: '== At least one webinar ==' },
      { value: 'all', label: '== All webinars ==' },
    ];
    return defaultOpts.concat(webinars?.map(webinar => ({ value: `${webinar.id}`, label: webinar.name })) || [])
  }, [webinars]);

  const rewardOpts = useMemo(() => settings?.doorprize?.rewards.map(reward => ({ value: `${reward.id}`, label: reward.name })), [settings])
  const reward = (idx: string | number) => settings?.doorprize?.rewards[parseInt(`${idx}`)]
  const rewardSrc = (idx: string | number) => reward(idx)?.image?.src;
  const rewardName = (idx: string | number) => reward(idx)?.name;

  const handleParamsChange = ({ selBooths, selWebinars }: SelProps) => {
    if (selBooths) {
      if (selBooths.length > 1) {
        const firstBooth = selBooths[0];
        const lastBooth = selBooths[selBooths.length - 1];
        if (['one', 'all'].includes(firstBooth) || ['one', 'all'].includes(lastBooth)) {
          selBooths = [lastBooth];
        }
      } else if (selBooths.length === 0) {
        selBooths = ['one'];
      }
      setSelBooths(selBooths);
    }
    if (selWebinars) {
      if (selWebinars.length > 1) {
        const firstWebinar = selWebinars[0];
        const lastWebinar = selWebinars[selWebinars.length - 1];
        if (['one', 'all'].includes(firstWebinar) || ['one', 'all'].includes(lastWebinar)) {
          selWebinars = [lastWebinar];
        }
      } else if (selWebinars.length === 0) {
        selWebinars = ['one'];
      }
      setSelWebinars(selWebinars);
    }
  }

  const calcRandomizerN = (delta: number, f = 60) => Math.round((((0 - 1 - 2 * f) + Math.sqrt(Math.pow(1 + 2 * f, 2) + 8 * (delta + 780 + f * 40))) / 2) - 40)

  const startRandomizing = () => {
    setRandomizing(true);
    searchWinner(0, calcRandomizerN(settings?.doorprize?.randomizer_time || 5000));
  }

  const searchWinner = (i: number, limit: number) => {
    if (i === limit) {
      setTempWinner(null);
      setWlWinner({ visitor: data?.winner, prize: reward(selReward) });
    } else {
      setTempWinner({ id: i, name: data?.list[i % data?.list.length] || '' });
      setTimeout(() => {
        searchWinner(i + 1, limit)
      }, 40 + i);
    }
  }

  const rejectWinner = () => {
    setWlWinner(null);
    setRandomizing(false);
  }

  const confirmWinner = () => {
    if (wlWinner) {
      notifications.showNotification({
        title: "Congratulations!",
        message: `${wlWinner.visitor?.name} won ${wlWinner.prize?.name || ''}`,
        color: "green",
      });
      setWinners([wlWinner, ...winners]);
    }
    setWlWinner(null);
    setRandomizing(false);
  }

  const censorNumber = (mobile: string | undefined) => mobile?.replace(/(\d{4})\d{0,6}(\d{4})/, '$1****$2');

  const sponsor = settings?.doorprize?.sponsors?.at(0);

  return (
    <AppShell
      navbar={<AdminSidebar />}
      styles={(theme) => ({
        main: {
          height: "100vh",
          overflow: "auto",
          padding: theme.spacing.xs,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        },
      })}
    >
      <Container size={1700}>
        <Title order={2} px={3}>
          Doorprize
        </Title>
        <Grid className={classes.root}>
          <Grid.Col span={3}>
            <Select
              label="Mode"
              data={[{ value: 'manual', label: 'Manual' }, { value: 'visitor', label: 'Visitor' }]}
              value={mode}
              onChange={mode => mode && setMode(mode)}
              disabled={isRandomizing || winners.length > 0}
              searchable
            />
          </Grid.Col>
          <Grid.Col span={3}>
            {mode === 'visitor' && (
              <MultiSelect
                label="Visited"
                data={boothOpts}
                value={selBooths}
                onChange={selBooths => handleParamsChange({ selBooths })}
                disabled={isRandomizing || winners.length > 0}
                searchable
              />
            )}
          </Grid.Col>
          <Grid.Col span={3}>
            {mode === 'visitor' && (
              <MultiSelect
                label="Attended"
                data={webinarOpts}
                value={selWebinars}
                onChange={selWebinars => handleParamsChange({ selWebinars })}
                disabled={isRandomizing || winners.length > 0}
                searchable
              />
            )}
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Doorprize"
              data={rewardOpts || []}
              value={selReward}
              onChange={reward => reward && setSelReward(reward)}
              disabled={isRandomizing}
              searchable
            />
          </Grid.Col>
          {mode === 'manual' && (
            <Grid.Col span={12}>
              <Textarea
                label="Candidates"
                value={manualCandidates}
                onChange={e => setManualCandidates(e.currentTarget.value)}
                minRows={8}
              />
            </Grid.Col>
          )}
          <Grid.Col span={4}>
            <Center>
              <Paper>
                <Group position="center">
                  <Text size="xs" color="dimmed" className={classes.title}>
                    These Doorprizes are sponsored by
                  </Text>
                </Group>
                <Group direction="column" align="center" spacing={4} mt="xs">
                  {sponsor && sponsor.image.src && (
                    <Image mt="lg" src={sponsor.image.src} alt="Our sponsors" height={200} />
                  )}
                </Group>
              </Paper>
            </Center>
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Paper>
                <Group position="center">
                  <Text size="xs" color="dimmed" className={classes.title}>
                    Total Candidates
                  </Text>
                </Group>
                <Group direction="column" align="center" spacing={4} mt="xs">
                  <Text className={classes.value}>{data?.total}</Text>
                  <Text className={classes.visitor}>Candidates</Text>
                  <Button loading={isRandomizing || isLoading} disabled={!data || !data.total} onClick={startRandomizing}>
                    Randomize
                  </Button>
                </Group>
              </Paper>
            </Center>
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Paper>
                <Group position="center">
                  <Text size="xs" color="dimmed" className={classes.title}>
                    Current Doorprize
                  </Text>
                </Group>
                <Group direction="column" align="center" spacing={4} mt="xs">
                  {rewardSrc(selReward) && (
                    <Image mt="lg" src={rewardSrc(selReward)} alt={rewardName(selReward)} height={200} />
                  )}
                </Group>
              </Paper>
            </Center>
          </Grid.Col>
          <Grid.Col span={12}>
            {(tempWinner || wlWinner || winners.length > 0) && (
              <Center style={{ marginTop: 60 }}>
                <Paper>
                  <Group position="center">
                    <Text size="xs" color="dimmed" className={classes.title}>
                      The Lucky Candidates
                    </Text>
                  </Group>
                  <Group direction="column" align="center" spacing={4} mt="xs">
                    {tempWinner && <div className={classes.winnerContainer}><Text className={classes.tempWinner}>{tempWinner?.name}</Text></div>}
                    {wlWinner && (
                      <div className={classes.winnerContainer}>
                        <Text align="center">{wlWinner.prize?.name}</Text>
                        <Text className={classes.value} align="center">{wlWinner.visitor?.name}</Text>
                        <Text align="center">{censored ? censorNumber(wlWinner.visitor?.mobile) : wlWinner.visitor?.mobile}</Text>
                        <Center>
                          <a href="#" onClick={confirmWinner} style={{ marginRight: 10 }}>Confirm</a>
                          <a href="#" onClick={rejectWinner}>Remove</a>
                        </Center>
                      </div>
                    )}
                    {winners.map(winner => (
                      <div key={winner.visitor?.id} className={classes.winnerContainer}>
                        <Text align="center">{winner.prize?.name}</Text>
                        <Text className={classes.value} align="center">{winner.visitor?.name}</Text>
                        <Text align="center">{censored ? censorNumber(winner.visitor?.mobile) : winner.visitor?.mobile}</Text>
                      </div>
                    ))}
                  </Group>
                  {winners.length > 0 && (
                    <Group position="center">
                      <Button onClick={() => setCensored(!censored)}>
                        {censored ? 'Show' : 'Hide'} Mobile Phone
                      </Button>
                      <Button type="reset" onClick={() => setWinners([])}>
                        Reset
                      </Button>
                    </Group>
                  )}
                </Paper>
              </Center>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  );
};

export default Randomizer;
