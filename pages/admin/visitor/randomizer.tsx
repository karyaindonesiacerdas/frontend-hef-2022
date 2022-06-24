import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { AppShell, Center, Container, Grid, Group, Paper, Select, Text, Title, createStyles, Button } from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { useBoothVisitors, useRandomVisitor, Visitor } from "services/counter-booth/hooks";
import { usePackages } from "services/package/hooks/usePackages";

interface SelProps {
  selBooth?: string | null;
  selWebinar?: string | null;
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
  const [selBooth, setSelBooth] = useState('one');
  const [selWebinar, setSelWebinar] = useState('one');
  const [isRandomizing, setRandomizing] = useState(false);
  const [tempWinner, setTempWinner] = useState<Visitor | null>();
  const [winners, setWinners] = useState<Visitor[]>([]);
  const [censored, setCensored] = useState(true);
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { data: booths } = useBoothVisitors();
  const { data: webinars } = usePackages();
  const { classes } = useStyles();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const {
    data,
    isLoading,
  } = useRandomVisitor({ boothId: selBooth, webinarId: selWebinar, winners: winners.map(w => w.id) });
  
  const boothOpts = useMemo(() => {
    const defaultOpts = [
      { value: 'one', label: '== At least one booth ==' },
      { value: 'all', label: '== All booths ==' },
    ];
    const filtered = booths?.filter(booth => booth.total_visitors > 0) || [];
    const sorted = filtered.sort((a, b) => a.company_name > b.company_name ? 1 : -1);
    return defaultOpts.concat(sorted.map(booth => ({ value: `${booth.id}`, label: booth.company_name })))
  } , [booths]);

  const webinarOpts = useMemo(() => {
    const defaultOpts = [
      { value: 'one', label: '== At least one webinar ==' },
      { value: 'all', label: '== All webinars ==' },
    ];
    return defaultOpts.concat(webinars?.map(webinar => ({ value: `${webinar.id}`, label: webinar.name })) || [])
  } , [webinars]);

  const handleParamsChange = ({ selBooth, selWebinar }: SelProps) => {
    if (selBooth) setSelBooth(selBooth);
    if (selWebinar) setSelWebinar(selWebinar);
  }

  const startRandomizing = () => {
    setRandomizing(true);
    searchWinner(0, 60);
  }
  
  const searchWinner = (i: number, limit: number) => {
    if (i === limit) {
      setTempWinner(null);
      if (data) {
        setWinners([data.winner, ...winners]);
      }
      setRandomizing(false);
    } else {
      setTempWinner({ id: i, name: data?.list[i % data?.list.length] || '' });
      setTimeout(() => {
        searchWinner(i + 1, limit)
      }, 40 + i);
    }
  }

  const censorNumber = (mobile: string | undefined) => mobile?.replace(/(\d{4})\d{0,6}(\d{4})/, '$1****$2');

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
          Randomizer
        </Title>
        <Grid className={classes.root}>
          <Grid.Col span={6}>
            <Select
              label="Visited"
              data={boothOpts}
              value={selBooth}
              onChange={selBooth => handleParamsChange({ selBooth })}
              disabled={winners.length > 0}
              searchable
              />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Attended"
              data={webinarOpts}
              value={selWebinar}
              onChange={selWebinar => handleParamsChange({ selWebinar })}
              disabled={winners.length > 0}
              searchable
            />
          </Grid.Col>
          <Grid.Col span={12}>
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
                  <Button loading={isRandomizing || isLoading} onClick={startRandomizing}>
                    Randomize
                  </Button>
                </Group>
              </Paper>
            </Center>
            {(tempWinner || winners.length > 0) && (
              <Center style={{ marginTop: 60 }}>
                <Paper>
                  <Group position="center">
                    <Text size="xs" color="dimmed" className={classes.title}>
                      The Lucky Candidates
                    </Text>
                  </Group>
                  <Group direction="column" align="center" spacing={4} mt="xs">
                    {tempWinner && <div className={classes.winnerContainer}><Text className={classes.tempWinner}>{tempWinner?.name}</Text></div>}
                    {winners.map(winner => (
                      <div key={winner.id} className={classes.winnerContainer}>
                        <Text className={classes.value} align="center">{winner.name}</Text>
                        <Text align="center">{censored ? censorNumber(winner.mobile) : winner.mobile}</Text>
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
