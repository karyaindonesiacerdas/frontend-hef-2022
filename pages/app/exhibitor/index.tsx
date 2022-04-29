import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import { createStyles, Image, Tooltip } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useExhibitors } from "services/exhibitor/hooks";
import {
  ArrowLeft,
  BuildingStore,
  DoorEnter,
  DoorExit,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
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
  exhibitorContainer: {
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
  exhibitor: {
    // width: "100%",
    // height: "100%",
  },
  backButton: {
    zIndex: 10,
    position: "fixed",
    top: 20,
    left: 20,
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
}));

const Exhibitor = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const { classes } = useStyles();
  const { data } = useExhibitors({});
  const exhibitors = data?.slice(0, 1);
  console.log({ exhibitors });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      {/* <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div> */}
      <NextLink className={classes.backButton} href="/app/exit-exhibitor">
        <DoorExit size={28} style={{ marginRight: 8 }} />
        <span>Exit</span>
      </NextLink>
      <div className={classes.container}>
        <div className={classes.exhibitorContainer}>
          {exhibitors?.map((exhibitor) => (
            <Tooltip label={exhibitor.company_name} key={exhibitor.id}>
              <NextLink
                className={classes.exhibitor}
                href={`/app/exhibitor/${exhibitor.id}`}
                style={{ textAlign: "center" }}
              >
                <BuildingStore size={52} />
              </NextLink>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exhibitor;
