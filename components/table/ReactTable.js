/* eslint-disable react/jsx-key */
import { useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  Center,
  Group,
  Skeleton,
  Table,
  Text,
  createStyles,
  ScrollArea,
} from "@mantine/core";
import { ChevronDown, ChevronUp, File, Selector } from "tabler-icons-react";

import { GlobalFilter } from "./GlobalFilter";
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

const ReactTable = ({
  showFooter,
  data,
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
}) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    footerGroups,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        ...initialState,
        pageSize: 10000,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  if (!isLoading && !data.length) {
    return (
      <div>
        <Group position="apart">
          {searchable ? (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          ) : (
            <div />
          )}
          <div>{action}</div>
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
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        ) : (
          <div />
        )}
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
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Group>
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
            {page.map((row) => {
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

export default ReactTable;

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
