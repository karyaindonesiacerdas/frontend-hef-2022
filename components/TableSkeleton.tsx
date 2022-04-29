import { Skeleton } from "@mantine/core";

type Props = {
  cols: number;
  rows: number;
};

export const TableSkeleton = ({ cols = 5, rows = 3 }: Props) => {
  return (
    <>
      {Array.from(Array(rows).keys()).map((_, indexRow) => (
        <tr key={indexRow}>
          {Array.from(Array(cols).keys()).map((_, indexCol) => (
            <td key={indexCol} style={{ padding: 16 }}>
              <Skeleton height={10} radius="xl" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
