import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import {
  Box,
  createStyles,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useExhibitors } from "services/exhibitor/hooks";
import {
  ArrowLeft,
  BuildingStore,
  DoorEnter,
  DoorExit,
} from "tabler-icons-react";
import { useLocalStorage, useMediaQuery, useOs } from "@mantine/hooks";
import BottomNav from "@/components/app-layout/BottomNav";
import RunningText from "@/components/RunningText";
import { getFileUrl } from "utils/file-storage";
import AppMobileLayout from "@/components/app-layout/AppMobileLayout";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100vh",
    overflow: "hidden",
  },
  container: {
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url('/hef-2022/exhibitors-hall.jpg')",
    width: "100%",
    height: "100%",
    aspectRatio: "2 / 1",
  },
  sidebar: {
    display: "block",
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  bottomNav: {
    display: "none",
    [theme.fn.smallerThan("xs")]: {
      display: "block",
    },
  },
  exhibitor: {
    // width: "100%",
    // height: "100%",
  },
  backButton: {
    zIndex: 10,
    position: "fixed",
    top: 20,
    right: 40,
    fontWeight: 600,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.dark,
    background: "rgba( 255, 255, 255, 0.5  )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    textDecoration: "none",
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: theme.colors[theme.primaryColor][6],
    },
  },
  backButtonMobile: {
    zIndex: 10,
    position: "fixed",
    top: 20,
    right: 20,
    fontWeight: 600,
    fontSize: theme.fontSizes.md,
    color: theme.colors.dark,
    background: "rgba( 255, 255, 255, 0.5  )",
    boxShadow: "0 3px 8px 0 rgba( 0, 0, 0, 0.17 )",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "10px",
    border: "1px solid rgba( 255, 255, 255, 0.18 )",
    textDecoration: "none",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: theme.colors[theme.primaryColor][6],
    },
  },
  exhibitorContainer1: {
    position: "absolute",
    top: "69%",
    right: "39%",
    perspective: "600px",
    width: "5vw",
    height: "5vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer2: {
    position: "absolute",
    top: "57%",
    right: "28%",
    perspective: "600px",
    width: "5vw",
    height: "5vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer3: {
    position: "absolute",
    top: "62%",
    right: "45%",
    perspective: "600px",
    width: "5vw",
    height: "5vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer4: {
    position: "absolute",
    top: "50%",
    right: "34%",
    perspective: "600px",
    width: "5vw",
    height: "5vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer5: {
    position: "absolute",
    top: "56%",
    right: "50.5%",
    perspective: "600px",
    width: "5vw",
    height: "5vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer6: {
    position: "absolute",
    top: "44%",
    right: "39.5%",
    perspective: "600px",
    width: "5vw",
    height: "5vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer7: {
    position: "absolute",
    top: "53%",
    right: "59.75%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer8: {
    position: "absolute",
    top: "49%",
    right: "57%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer9: {
    position: "absolute",
    top: "46%",
    right: "54.5%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer10: {
    position: "absolute",
    top: "42%",
    right: "51%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer11: {
    position: "absolute",
    top: "39%",
    right: "48.25%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer12: {
    position: "absolute",
    top: "36%",
    right: "45.75%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer13: {
    position: "absolute",
    top: "49%",
    right: "62.75%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer14: {
    position: "absolute",
    top: "46%",
    right: "60%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer15: {
    position: "absolute",
    top: "43%",
    right: "57.5%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer16: {
    position: "absolute",
    top: "38%",
    right: "54%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer17: {
    position: "absolute",
    top: "35%",
    right: "51.25%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer18: {
    position: "absolute",
    top: "32%",
    right: "48.75%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer19: {
    position: "absolute",
    top: "45%",
    right: "66%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer20: {
    position: "absolute",
    top: "42%",
    right: "63.25%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer21: {
    position: "absolute",
    top: "39%",
    right: "60.75%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer22: {
    position: "absolute",
    top: "34.5%",
    right: "57.25%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer23: {
    position: "absolute",
    top: "31.5%",
    right: "54.5%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  exhibitorContainer24: {
    position: "absolute",
    top: "28.5%",
    right: "52%",
    perspective: "600px",
    width: "3vw",
    height: "3vw",
    // height: "31.2%",
    ":hover": {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      ":svg": {
        color: "rgba(255,0,0, 1)",
      },
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    "&:svg": {
      color: "rgba(255,0,0, 0.3)",
    },
  },
  title: {
    fontSize: theme.fontSizes.xl * 1.2,
    textAlign: "center",
  },
  exhibitorLink: {
    // border: "1px solid",
    // borderColor: theme.colors.gray[3],
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
    backgroundColor: theme.colors.gray[1],
    borderRadius: theme.radius.md,
    "&:hover": {
      backgroundColor: theme.colors[theme.primaryColor][1],
    },
  },
  exhibitorLinkSmall: {
    // border: "1px solid",
    // borderColor: theme.colors.gray[3],
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
    backgroundColor: theme.colors.gray[1],
    borderRadius: theme.radius.md,
    "&:hover": {
      backgroundColor: theme.colors[theme.primaryColor][1],
    },
  },
}));

const Exhibitor = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes } = useStyles();
  const { data: exhibitors } = useExhibitors({ showAll: false });
  const [value, setValue] = useLocalStorage({
    key: "skip-exit",
    defaultValue: false,
  });
  const theme = useMantineTheme();
  const largerThanXs = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px)`);
  const os = useOs();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  useEffect(() => {
    if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/app/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const exhibitor1 = exhibitors?.find((exhibitor) => exhibitor.position === 1);
  const exhibitor2 = exhibitors?.find((exhibitor) => exhibitor.position === 2);
  const exhibitor3 = exhibitors?.find((exhibitor) => exhibitor.position === 3);
  const exhibitor4 = exhibitors?.find((exhibitor) => exhibitor.position === 4);
  const exhibitor5 = exhibitors?.find((exhibitor) => exhibitor.position === 5);
  const exhibitor6 = exhibitors?.find((exhibitor) => exhibitor.position === 6);

  const exhibitor7 = exhibitors?.find((exhibitor) => exhibitor.position === 7);
  const exhibitor8 = exhibitors?.find((exhibitor) => exhibitor.position === 8);
  const exhibitor9 = exhibitors?.find((exhibitor) => exhibitor.position === 9);
  const exhibitor10 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 10
  );
  const exhibitor11 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 11
  );
  const exhibitor12 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 12
  );
  const exhibitor13 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 13
  );
  const exhibitor14 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 14
  );
  const exhibitor15 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 15
  );
  const exhibitor16 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 16
  );
  const exhibitor17 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 17
  );
  const exhibitor18 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 18
  );
  const exhibitor19 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 19
  );
  const exhibitor20 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 20
  );
  const exhibitor21 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 21
  );
  const exhibitor22 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 22
  );
  const exhibitor23 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 23
  );
  const exhibitor24 = exhibitors?.find(
    (exhibitor) => exhibitor.position === 24
  );

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  console.log({ exhibitor2 });
  const isMobile = os === "android" || os === "ios";

  return (
    <div>
      {isMobile ? (
        <div style={{ position: "absolute", top: 20, left: 16, zIndex: 100 }}>
          <AppMobileLayout />
        </div>
      ) : (
        <div
          style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}
          // className={classes.sidebar}
        >
          <AppLayout />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 50,
          width: "100%",
        }}
        className={classes.bottomNav}
      >
        <BottomNav />
      </div>

      <Box
        style={{
          position: "absolute",
          // inset: 0,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
        }}
        className={classes.bottomNav}
      >
        <RunningText />
      </Box>

      {largerThanXs ? (
        <>
          <NextLink
            className={isMobile ? classes.backButtonMobile : classes.backButton}
            href={value === true ? "/app/main-hall" : "/app/exit-exhibitor"}
          >
            <DoorExit size={isMobile ? 16 : 28} style={{ marginRight: 8 }} />
            <span>Exit</span>
          </NextLink>
          <div className={classes.container}>
            <div className={classes.exhibitorContainer1}>
              {exhibitor1 ? (
                <Tooltip label={exhibitor1.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor1.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer2}>
              {exhibitor2 ? (
                <Tooltip label={exhibitor2.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor2.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer3}>
              {exhibitor3 ? (
                <Tooltip label={exhibitor3.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor3.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer4}>
              {exhibitor4 ? (
                <Tooltip label={exhibitor4.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor4.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer5}>
              {exhibitor5 ? (
                <Tooltip label={exhibitor5.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor5.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer6}>
              {exhibitor6 ? (
                <Tooltip label={exhibitor6.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor6.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            {/* Small */}
            <div className={classes.exhibitorContainer7}>
              {exhibitor7 ? (
                <Tooltip label={exhibitor7.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor7.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer8}>
              {exhibitor8 ? (
                <Tooltip label={exhibitor8.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor8.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer9}>
              {exhibitor9 ? (
                <Tooltip label={exhibitor9.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor9.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer10}>
              {exhibitor10 ? (
                <Tooltip label={exhibitor10.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor10.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer11}>
              {exhibitor11 ? (
                <Tooltip label={exhibitor11.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor11.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer12}>
              {exhibitor12 ? (
                <Tooltip label={exhibitor12.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor12.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer13}>
              {exhibitor13 ? (
                <Tooltip label={exhibitor13.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor13.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer14}>
              {exhibitor14 ? (
                <Tooltip label={exhibitor14.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor14.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer15}>
              {exhibitor15 ? (
                <Tooltip label={exhibitor15.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor15.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer16}>
              {exhibitor16 ? (
                <Tooltip label={exhibitor16.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor16.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer17}>
              {exhibitor17 ? (
                <Tooltip label={exhibitor17.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor17.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer18}>
              {exhibitor18 ? (
                <Tooltip label={exhibitor18.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor18.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer19}>
              {exhibitor19 ? (
                <Tooltip label={exhibitor19.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor19.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer20}>
              {exhibitor20 ? (
                <Tooltip label={exhibitor20.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor20.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer21}>
              {exhibitor21 ? (
                <Tooltip label={exhibitor21.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor21.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer22}>
              {exhibitor22 ? (
                <Tooltip label={exhibitor22.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor22.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer23}>
              {exhibitor23 ? (
                <Tooltip label={exhibitor23.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor23.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
            <div className={classes.exhibitorContainer24}>
              {exhibitor24 ? (
                <Tooltip label={exhibitor24.company_name}>
                  <NextLink
                    className={classes.exhibitor}
                    href={`/app/exhibitor/${exhibitor24.id}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ width: 60, height: 60 }} />
                    {/* <BuildingStore size={52} /> */}
                  </NextLink>
                </Tooltip>
              ) : (
                <Empty />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={classes.root}>
          <Stack mt={55}>
            <Title className={classes.title}>Exhibitors</Title>
            <SimpleGrid spacing="xs" cols={2} px="md" mt="sm">
              {exhibitors
                ?.filter(
                  (exhibitor) =>
                    exhibitor.position < 7 && exhibitor.position > 0
                )
                ?.map((exhibitor) => (
                  <UnstyledButton
                    key={exhibitor.id}
                    onClick={() =>
                      router.push(`/app/exhibitor/${exhibitor.id}`)
                    }
                    className={classes.exhibitorLink}
                  >
                    <Stack align="center" spacing="xs">
                      <Image
                        src={
                          exhibitor?.company_logo
                            ? getFileUrl(exhibitor.company_logo, "companies")
                            : "/hef-2022/logoipsum.svg"
                        }
                        alt={exhibitor.name}
                      />
                      <Text color="dimmed" size="xs" lineClamp={1}>
                        {exhibitor.company_name}
                      </Text>
                    </Stack>
                  </UnstyledButton>
                ))}
            </SimpleGrid>
            <SimpleGrid spacing="xs" cols={3} px="md">
              {exhibitors
                ?.filter((exhibitor) => exhibitor.position > 6)
                ?.map((exhibitor) => (
                  <UnstyledButton
                    key={exhibitor.id}
                    onClick={() =>
                      router.push(`/app/exhibitor/${exhibitor.id}`)
                    }
                    className={classes.exhibitorLinkSmall}
                  >
                    <Stack align="center" spacing={8}>
                      <Image
                        src={
                          exhibitor?.company_logo
                            ? getFileUrl(exhibitor.company_logo, "companies")
                            : "/hef-2022/logoipsum.svg"
                        }
                        alt={exhibitor.name}
                      />
                      <Text color="dimmed" size="xs" lineClamp={1}>
                        {exhibitor.company_name}
                      </Text>
                    </Stack>
                  </UnstyledButton>
                ))}
            </SimpleGrid>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default Exhibitor;

const Empty = () => {
  return (
    <Tooltip label="Empty">
      <div style={{ width: 60, height: 60 }} />
    </Tooltip>
  );
};
