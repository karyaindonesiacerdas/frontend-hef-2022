import { createStyles, LoadingOverlay, Paper, Select, SimpleGrid, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { usePackages } from "services/package/hooks/usePackages";
import { useVisitorDemographic } from "services/user/hooks";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  }
}));

const VisitorDemographic = () => {
  const [filter, setFilter] = useState('all');
  const { classes } = useStyles();
  const { data, isSuccess, isLoading } = useVisitorDemographic(filter);
  const { data: packages } = usePackages();

  const packageOpts = useMemo(() => {
    const retval = packages?.sort((a, b) => a.order - b.order).map(p => ({ value: String(p.id), label: p.name })) || [];
    retval.splice(0, 0, { value: 'all', label: '== Select One Webinar to Filter ==' });
    return retval;
  }, [packages]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Title order={2} px={3} sx={(theme) => ({ fontSize: theme.fontSizes.xl })}>
          Demographic
        </Title>
        <Select data={packageOpts} value={filter} onChange={v => setFilter(v || 'all')} style={{ width: 400 }} />
      </div>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: "xl", cols: 2 },
          { maxWidth: "lg", cols: 1 },
        ]}
        style={{ marginBottom: 30 }}
      >
        <Paper withBorder p="md" radius="md" style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoading} />
          {isSuccess && (
            <Chart
              type="donut"
              series={data.institution_types.series}
              options={{
                labels: data.institution_types.labels,
                legend: { position: 'bottom' },
                title: {
                  text: data.institution_types.name,
                  align: "left",
                },
              }}
              width="100%"
            />
          )}
        </Paper>
        <Paper withBorder p="md" radius="md" style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoading} />
          {isSuccess && (
            <Chart
              type="donut"
              series={data.positions.series}
              options={{
                labels: data.positions.labels,
                legend: { position: 'bottom' },
                title: {
                  text: data.positions.name,
                  align: "left",
                },
              }}
              width="100%"
            />
          )}
        </Paper>
      </SimpleGrid>
      <SimpleGrid cols={1}>
        <Paper withBorder p="md" radius="md" style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoading} />
          {isSuccess && (
            <Chart
              type="bar"
              series={data.provinces.series}
              options={{
                title: {
                  text: data.provinces.name,
                  align: "left",
                },
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                    horizontal: true,
                  }
                },
                xaxis: {
                  categories: data.provinces.labels
                }
              }}
              width="100%"
              height={1400}
            />
          )}
        </Paper>
      </SimpleGrid>
    </div>
  );
};

export default VisitorDemographic;
