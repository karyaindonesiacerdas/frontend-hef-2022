import { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  AppShell,
  Button,
  Container,
  Drawer,
  Group,
  NumberInput,
  Select,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";

import AdminSidebar from "components/admin-layout/AdminSidebar";
import ReactTable from "components/table/ReactTable";
import { useAuth } from "contexts/auth.context";
import { useVisitorViews } from "services/counter-booth/hooks";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import dayjs from 'dayjs'

type Props = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuestBookDrawer = ({ opened, setOpened }: Props) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [limit, setLimit] = useState("25");
  const [page, setPage] = useState(1);



  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isInitialized, isAuthenticated]);

  const {
    data: visitorViews,
    isSuccess: isSuccessVisitorViews,
    isLoading: isLoadingVisitorViews,
  } = useVisitorViews({ limit: +limit, page });

  const data = useMemo(
    () =>
      isSuccessVisitorViews &&
      visitorViews?.data?.map((visitorView, i) => ({
        no: i + 1,
        id: visitorView?.id,
        name: visitorView?.visitor?.name,
        email: visitorView?.visitor?.email,
        mobile: visitorView?.visitor?.mobile,
        province: visitorView?.visitor?.province,
        institution_name: visitorView?.visitor?.institution_name,
        created_at: dayjs(visitorView?.created_at).format('YYYY-MM-DD HH:mm'),
      })),
    [visitorViews, isSuccessVisitorViews]
  );

  const columns = useMemo(
    () => [
      {
        Header: "No",
        Footer: "No",
        accessor: "no",
      },
      {
        Header: "Name",
        Footer: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        Footer: "Email",
        accessor: "email",
      },
      {
        Header: "Mobile",
        Footer: "Mobile",
        accessor: "mobile",
      },
      {
        Header: "Province",
        Footer: "Province",
        accessor: "province",
      },
      {
        Header: "Institution Name",
        Footer: "Institution Name",
        accessor: "institution_name",
      },
      {
        Header: "Datetime",
        Footer: "Datetime",
        accessor: "created_at",
      },
    ],
    []
  );

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  const action = (
    <Group align="end">
      <Select
        label="Limit"
        styles={{
          input: {
            width: 100,
          },
        }}
        data={[
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
          { value: "500", label: "500" },
          { value: "1000", label: "1000" },
          { value: "5000", label: "5000" },
        ]}
        value={limit}
        onChange={(v) => (v ? setLimit(v) : setLimit("25"))}
      />
      <Group spacing="xs">
        <NumberInput
          styles={{
            input: {
              width: 100,
            },
          }}
          placeholder="Page"
          label="Page"
          value={page}
          min={1}
          max={visitorViews?.last_page}
          onChange={(v) => {
            if (v) {
              if (visitorViews?.last_page) {
                if (v > visitorViews?.last_page) {
                  setPage(visitorViews?.last_page);
                } else {
                  setPage(v);
                }
              }
            } else {
              setPage(1);
            }
          }}
        />
        <Text mt="xl" weight={600} size="sm">
          of {visitorViews?.last_page || "xx"}
        </Text>
      </Group>
      <Group>
        <Button
          disabled={isLoadingVisitorViews || page === 1}
          styles={{ root: { paddingLeft: 8 } }}
          leftIcon={<ChevronLeft size={14} />}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        <Button
          disabled={isLoadingVisitorViews || page === visitorViews?.last_page}
          styles={{ root: { paddingRight: 8 } }}
          rightIcon={<ChevronRight size={14} />}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Group>
    </Group>
  );

  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={1} style={{ fontSize: theme.fontSizes.xl }}>
          Booth Visitors: {visitorViews?.total}
        </Title>
      }
      padding="xl"
      size="90vw"
      styles={{
        drawer: {
          overflow: "auto",
        },
      }}
    >
      <ReactTable
        showFooter={false}
        data={data || []}
        columns={columns}
        searchable={false}
        sortable={false}
        pagination={true}
        downloadable={true}
        skeletonCols={8}
        isLoading={isLoadingVisitorViews}
        action={action}
      />
    </Drawer>
  );
};

export default GuestBookDrawer;