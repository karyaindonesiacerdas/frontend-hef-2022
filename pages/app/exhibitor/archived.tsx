import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import { createStyles, Image } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useExhibitors } from "services/exhibitor/hooks";

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
    top: "45%",
    left: "43%",
    perspective: "600px",
    width: "15%",
    height: "31.2%",
  },
  exhibitor: {
    width: "100%",
    height: "100%",
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
      <div style={{ position: "absolute", top: 16, left: 10, zIndex: 50 }}>
        <AppLayout />
      </div>
      <div className={classes.container}>
        <div className={classes.exhibitorContainer}>
          {exhibitors?.map((exhibitor) => (
            <NextLink
              key={exhibitor.id}
              className={classes.exhibitor}
              href={`/app/exhibitor/${exhibitor.id}`}
              style={{ textAlign: "center" }}
            >
              <Image
                src={
                  exhibitor.company_logo
                    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/companies/${exhibitor.company_logo}`
                    : "/logo-placeholder.svg"
                }
                alt={exhibitor.company_name}
              />
            </NextLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exhibitor;
