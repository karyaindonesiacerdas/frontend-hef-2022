/* eslint-disable react/jsx-key */
import { Group, Table } from "@mantine/core";
import { useTable, useSortBy } from "react-table";
import { ChevronDown, ChevronUp, Selector } from "tabler-icons-react";

export default function BasicTable({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <Group>
                  <span>{column.render("Header")}</span>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronUp size={14} />
                    )
                  ) : (
                    <Selector size={14} />
                  )}
                </Group>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
