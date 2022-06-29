import { createStyles, LoadingOverlay, Paper, SimpleGrid } from "@mantine/core";
import Chart from "react-apexcharts";
import { useVisitorDemographic } from "services/user/hooks";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
}));

const VisitorDemographic = () => {
  const { classes } = useStyles();
  const { data, isSuccess, isLoading } = useVisitorDemographic()

  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: "xl", cols: 2 },
          { maxWidth: "lg", cols: 1 },
        ]}
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
        <Paper withBorder p="md" radius="md" style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoading} />
          {isSuccess && (
            <Chart
              type="donut"
              series={data.provinces.series}
              options={{
                labels: data.provinces.labels,
                legend: { position: 'bottom' },
                title: {
                  text: data.provinces.name,
                  align: "left",
                },
              }}
              width="100%"
            />
          )}
        </Paper>
      </SimpleGrid>
    </div>
  );
};

export default VisitorDemographic;
