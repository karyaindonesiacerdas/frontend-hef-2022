import { createStyles, LoadingOverlay, Paper, SimpleGrid } from "@mantine/core";
import Chart from "react-apexcharts";
import {
  useGraphAccumulative,
  useGraphProvince,
  useGraphTotal,
} from "services/tracker/hooks";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
}));

const StatsGraph = () => {
  const { classes } = useStyles();
  const {
    data: graphTotal,
    isSuccess: isSuccessGraphTotal,
    isLoading: isLoadingGraphTotal,
  } = useGraphTotal();
  const {
    data: graphAccumulative,
    isSuccess: isSuccessGraphAccumulative,
    isLoading: isLoadingGraphAccumulative,
  } = useGraphAccumulative();
  const {
    data: graphProvince,
    isSuccess: isSuccessGraphProvince,
    isLoading: isLoadingGraphProvince,
  } = useGraphProvince();

  const series = [
    {
      name: "Visitor",
      data: graphTotal?.map((statistic: any) => statistic.total),
    },
  ];

  const series2 = [
    {
      name: "Visitor Accumulative",
      data: graphAccumulative?.map((statistic: any) => statistic.total),
    },
  ];

  const series3 = graphProvince?.map((statistic: any) => statistic.total);
  const label3 = graphProvince?.map((statistic: any) => {
    if (statistic.province === "") {
      return "Unknown";
    }
    if (!statistic.province) {
      return "Lainnya";
    }
    return statistic.province;
  });

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
          <LoadingOverlay visible={isLoadingGraphTotal} />
          {isSuccessGraphTotal && (
            <Chart
              options={{
                chart: {
                  height: 350,
                  type: "area",
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                },
                xaxis: {
                  type: "datetime",
                  categories:
                    graphTotal?.map((statistic: any) => statistic.date) || [],
                },
                yaxis: {
                  min: 0,
                  // max: 240,
                  title: {
                    text: "Visitor",
                  },
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yy HH:mm",
                  },
                },

                title: {
                  text: "Total Visitor",
                  align: "left",
                },
              }}
              series={series || []}
              type="area"
              width="100%"
            />
          )}
        </Paper>
        <Paper withBorder p="md" radius="md" style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoadingGraphAccumulative} />
          {isSuccessGraphAccumulative && (
            <Chart
              options={{
                chart: {
                  height: 350,
                  type: "area",
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                },
                xaxis: {
                  type: "datetime",
                  categories:
                    graphAccumulative?.map(
                      (statistic: any) => statistic.date
                    ) || [],
                },
                yaxis: {
                  min: 0,
                  // max: 240,
                  title: {
                    text: "Visitor Accumulative",
                  },
                },
                tooltip: {
                  x: {
                    format: "dd/MM/yy HH:mm",
                  },
                },

                title: {
                  text: "Visitor Accumulative",
                  align: "left",
                },
              }}
              series={series2 || []}
              type="area"
              width="100%"
            />
          )}
        </Paper>
        <Paper withBorder p="md" radius="md" style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoadingGraphProvince} />
          {isSuccessGraphProvince && (
            <Chart
              type="donut"
              series={series3}
              options={{
                labels: label3,
                title: {
                  text: "Visitor / Provinsi",
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

export default StatsGraph;
