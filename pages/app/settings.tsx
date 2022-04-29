import React, { useEffect } from "react";
import { useRouter } from "next/router";

import AppLayout from "@/components/app-layout/AppLayout";
import { useAuth } from "contexts/auth.context";
import { Container, Title } from "@mantine/core";

const Settings = () => {
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
      <Container size="xl" py="xl">
        <Title>Settings</Title>
      </Container>
    </div>
  );
};

export default Settings;
