import React, { useEffect } from "react";

import AppLayout from "@/components/app-layout/AppLayout";
import { useRouter } from "next/router";
import { useAuth } from "contexts/auth.context";

const WebinarSchedule = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

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
    </div>
  );
};

export default WebinarSchedule;
