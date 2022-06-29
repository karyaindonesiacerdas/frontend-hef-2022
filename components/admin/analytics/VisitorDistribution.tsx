import { useMemo } from 'react'
import { createStyles, LoadingOverlay, Paper, SimpleGrid } from "@mantine/core";
import Chart from "react-apexcharts";

import { useBoothVisitors, useWebinarAttendees } from "services/counter-booth/hooks";

const useStyles = createStyles((theme) => ({
  chart: {
    margin: theme.spacing.xs * 0.5,
    marginBottom: theme.spacing.xl,
  },
}));

const VisitorDistribution = () => {
  const { classes } = useStyles();
  const {
    data: webinarAttendees,
    isLoading: isWebinarLoading,
    isSuccess: isWebinarSuccess
  } = useWebinarAttendees();
  const {
    data: boothVisitors,
    isLoading: isBoothLoading,
    isSuccess: isBoothSuccess
  } = useBoothVisitors();

  const [webinarSeries, webinarLabels] = useMemo(() => {
    const labels: string[] = []
    const surveyedData: number[] = []
    const registeredData = webinarAttendees
      ?.filter(webinar => parseInt(webinar.id) > 0)
      .sort((a, b) => a.order - b.order)
      .map(webinar => {
        labels.push(webinar.name)
        surveyedData.push(webinar.total_attendees.surveyed)
        return webinar.total_attendees.registered
      })
    return [
      [
        { data: registeredData || [], name: 'registered' },
        { data: surveyedData || [], name: 'actual' },
      ],
      labels
    ]
  }, [webinarAttendees])

  const [boothSeries, boothLabels] = useMemo(() => {
    const labels: string[] = []
    const data = boothVisitors
      ?.filter(booth => parseInt(booth.id) > 0 && booth.total_visitors > 0)
      .sort((a, b) => b.total_visitors - a.total_visitors)
      .map(booth => {
        labels.push(booth.company_name)
        return booth.total_visitors
      })
    return [
      [{ data: data || [], name: 'visitors' }],
      labels
    ]
  }, [boothVisitors])

  return (
    <div>
      <Paper withBorder p="md" radius="md" style={{ position: "relative" }} className={classes.chart}>
        <LoadingOverlay visible={isWebinarLoading} />
        {isWebinarSuccess && (
          <Chart
            type="bar"
            series={webinarSeries}
            options={{
              title: {
                text: 'Webinar Attendees',
                align: "left",
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: true,
                }
              },
              xaxis: {
                categories: webinarLabels,
              }
            }}
            width="100%"
            height={450}
          />
        )}
      </Paper>
      <Paper withBorder p="md" radius="md" style={{ position: "relative" }} className={classes.chart}>
        <LoadingOverlay visible={isBoothLoading} />
        {isBoothSuccess && (
          <Chart
            type="bar"
            series={boothSeries}
            options={{
              title: {
                text: 'Booth Visitors',
                align: "left",
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: true,
                }
              },
              xaxis: {
                categories: boothLabels
              }
            }}
            width="100%"
            height={600}
          />
        )}
      </Paper>
    </div>
  );
};

export default VisitorDistribution;
