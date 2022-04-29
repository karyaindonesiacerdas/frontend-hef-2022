import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import { createStyles, keyframes, UnstyledButton } from "@mantine/core";
import SeminarScreen from "@/components/seminar/SeminarScreen";
import SeminarRundown from "@/components/seminar/SeminarRundown";

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: "url('/hef-2022/seminar-hall.jpg')",
    width: "100%",
    height: "100%",
    aspectRatio: "2 / 1",
  },
  rundownButtonContainer: {
    position: "absolute",
  },
  rundownButton: {
    width: 85,
    height: 85,
    position: "fixed",
    top: 40,
    right: 55,
    borderRadius: 1000,
    backgroundColor: theme.colors[theme.primaryColor][0],
    opacity: 0.8,
    color: theme.colors[theme.primaryColor][6],
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    border: "4px solid teal",
    cursor: "pointer",
    "&:hover": {
      animation: "none",
      opacity: 1,
    },
  },
}));

const Seminar = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const { classes } = useStyles();
  const [openRundown, setOpenRundown] = useState(true);

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
      <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div>
      <div className={classes.container}>
        <SeminarScreen />
        <SeminarRundown opened={openRundown} setOpened={setOpenRundown} />
        <div className={classes.rundownButtonContainer}>
          <UnstyledButton
            className={classes.rundownButton}
            onClick={() => setOpenRundown((prev) => !prev)}
          >
            {openRundown ? "Close" : "Open"} Rundown
          </UnstyledButton>
        </div>
      </div>
    </div>
  );
};

export default Seminar;
