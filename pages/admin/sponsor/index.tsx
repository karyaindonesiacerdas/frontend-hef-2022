import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  AppShell,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { Archive, Plus } from "tabler-icons-react";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import { useAuth } from "contexts/auth.context";
import { useSponsors } from "services/sponsor/hooks";
import AddSponsorModal from "components/admin/sponsor/AddSponsorModal";
import EditAndDeleteSponsorModal from "components/admin/sponsor/EditAndDeleteSponsorModal";
import NoContent from "components/NoContent";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  card: {
    padding: theme.spacing.md,
    boxShadow: theme.shadows.xs,
    "&:hover": {
      boxShadow: theme.shadows.xl,
    },
    cursor: "pointer",
    overflow: "hidden",
  },
}));

type Sponsor = {
  _id: string;
  name: string;
  level: string;
  logo: {
    src: string;
    filename: string;
  };
};

const AdminSponsor: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { classes } = useStyles();
  const [openedAddModal, setOpenedAddModal] = useState(false);
  const [openedEditAndDeleteModal, setOpenedEditAndDeleteModal] =
    useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor>();
  const theme = useMantineTheme();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    } else if (isInitialized && isAuthenticated && user?.role !== "admin") {
      router.replace("/main-hall");
    }
  }, [router, isInitialized, isAuthenticated, user?.role]);

  const { data: sponsors } = useSponsors();

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <AppShell
      navbar={<AdminSidebar />}
      styles={(theme) => ({
        main: {
          height: "100vh",
          overflow: "auto",
          padding: theme.spacing.xs,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.sm,
        },
      })}
    >
      <Container size={1700}>
        <Group position="apart">
          <Title order={2} px={3}>
            Sponsor
          </Title>
          {sponsors?.length ? (
            <Button
              onClick={() => {
                setOpenedAddModal(true);
              }}
              leftIcon={<Plus size={16} />}
            >
              Add New Sponsor
            </Button>
          ) : null}
        </Group>
        <AddSponsorModal
          opened={openedAddModal}
          setOpened={setOpenedAddModal}
        />
        <EditAndDeleteSponsorModal
          opened={openedEditAndDeleteModal}
          setOpened={setOpenedEditAndDeleteModal}
          selectedSponsor={selectedSponsor}
          setSelectedSponsor={setSelectedSponsor}
        />
        <div className={classes.root}>
          {!sponsors?.length && (
            <NoContent
              text="No Content"
              action={
                <Button
                  onClick={() => {
                    setOpenedAddModal(true);
                  }}
                  leftIcon={<Plus size={16} />}
                >
                  Add New Sponsor
                </Button>
              }
            />
          )}

          <SimpleGrid cols={5}>
            {sponsors?.map((sponsor) => (
              <UnstyledButton
                key={sponsor._id}
                onClick={() => {
                  setSelectedSponsor(sponsor);
                  setOpenedEditAndDeleteModal(true);
                }}
              >
                <Paper className={classes.card} withBorder>
                  <Image
                    height={100}
                    fit="contain"
                    src={sponsor.logo.src}
                    alt={sponsor.name}
                  />
                  <Text mt="sm" align="center" weight={600} size="lg">
                    {sponsor.name}
                  </Text>
                </Paper>
              </UnstyledButton>
            ))}
          </SimpleGrid>
        </div>
      </Container>
    </AppShell>
  );
};

export default AdminSponsor;
