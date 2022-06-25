/* eslint-disable react/jsx-key */
import { useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  Button,
  Center,
  Group,
  NumberInput,
  ScrollArea,
  Select,
  Skeleton,
  Table,
  Text,
  createStyles,
} from "@mantine/core";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, File, Selector } from "tabler-icons-react";

import { KamalGlobalFilter } from "./KamalGlobalFilter";
import ReactHTMLTableToExcel from "./ReactHTMLTableToExcel";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xs * 0.5,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const KamalReactTable = ({
  showFooter,
  data,
  total,
  columns,
  searchable = true,
  pagination = true,
  dense = false,
  action = <div />,
  isLoading = false,
  isFetching = false,
  skeletonCols = 5,
  skeletonRows = 5,
  extraPaddingBottom = true,
  initialState = {},
  downloadable = false,
  sortable = true,
  actionable = false,
  onParamsChange,
}) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
    setGlobalFilter,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState,
      manualSortBy: true
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;
  const pageCount = Math.ceil(total / pageSize);

  const handlePageIndexChange = newPageIndex => {
    const pageIndex = newPageIndex > pageCount ? pageCount : newPageIndex;
    onParamsChange({ pageIndex });
  }

  const handlePageSizeChange = newPageSize => {
    const pageSize = parseInt(newPageSize);
    setPageSize(pageSize);
    onParamsChange({ pageSize });
  }

  const handleFilterChange = newFilter => {
    const filter = newFilter || '';
    setGlobalFilter(filter);
    onParamsChange({ pageIndex: 1, filter });
  }

  const handleSortChange = column => {
    setTimeout(() => {
      const sortColumn = column.isSorted ? column.id : '-';
      const sortDirection = column.isSortedDesc ? 'DESC' : 'ASC';
      onParamsChange({ sort: { sortColumn, sortDirection } });
    }, 50);
  }

  if (!isLoading && !data.length) {
    return (
      <div>
        <Group position="apart">
          {searchable ? (
            <KamalGlobalFilter
              total={total}
              globalFilter={globalFilter}
              setGlobalFilter={handleFilterChange}
            />
          ) : (
            <div />
          )}
        </Group>
        <Center style={{ width: "100%", height: "60vh" }}>
          <Group direction="column" align="center">
            <File size={60} />
            <Text size="lg" weight={700}>
              No Data
            </Text>
          </Group>
        </Center>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Group position="apart" align="end" mb="md">
        {searchable ? (
          <KamalGlobalFilter
            total={total}
            globalFilter={globalFilter}
            setGlobalFilter={handleFilterChange}
          />
        ) : (
          <div />
        )}
        <Group align="end">
          <Group align="end">
            {downloadable && (
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="table-to-xls"
                filename="tablexls"
                sheet="tablexls"
                buttonText="Download as XLS"
              />
            )}
            {action}
          </Group>
          {pagination && (
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
                value={String(pageSize)}
                onChange={v => handlePageSizeChange(v)}
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
                  value={pageIndex}
                  min={1}
                  max={pageCount}
                  onChange={v => handlePageIndexChange(v)}
                />
                <Text mt="xl" weight={600} size="sm">
                  of {pageCount || "xx"}
                </Text>
              </Group>
              <Group>
                <Button
                  disabled={isLoading || pageIndex === 1}
                  styles={{ root: { paddingLeft: 8 } }}
                  leftIcon={<ChevronLeft size={14} />}
                  onClick={() => handlePageIndexChange(pageIndex - 1)}
                >
                  Prev
                </Button>
                <Button
                  disabled={isLoading || pageIndex === pageCount}
                  styles={{ root: { paddingRight: 8 } }}
                  rightIcon={<ChevronRight size={14} />}
                  onClick={() => handlePageIndexChange(pageIndex + 1)}
                >
                  Next
                </Button>
              </Group>
            </Group>
          )}
        </Group>
      </Group>

      <ScrollArea
        sx={{ height: "75vh" }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table id="table-to-xls" {...getTableProps()}>
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps({ ...column.getSortByToggleProps(), style: { minWidth: column.minWidth } })}>
                    <Group onClick={() => handleSortChange(column)}>
                      <span>{column.render("Header")}</span>
                      {sortable && column.isSorted && (
                        column.isSortedDesc ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronUp size={14} />
                        )
                      )}
                      {sortable && !column.isSorted && (
                        <Selector size={14} />
                      )}
                    </Group>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isLoading && (
              <TableSkeleton cols={skeletonCols} rows={skeletonRows} />
            )}
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default KamalReactTable;

const TableSkeleton = ({ cols, rows }) => {
  return Array.from(Array(rows).keys()).map((_, indexRow) => (
    <tr key={indexRow}>
      {Array.from(Array(cols).keys()).map((_, indexCol) => (
        <td key={indexCol} style={{ padding: 16 }}>
          <Skeleton height={10} radius="xl" />
        </td>
      ))}
    </tr>
  ));
};
