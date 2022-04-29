import React, { useState } from "react";
import { TextInput } from "@mantine/core";
import { Search } from "tabler-icons-react";
import { useAsyncDebounce } from "react-table";

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <TextInput
      icon={<Search size={18} />}
      size="md"
      rightSectionWidth={42}
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search from ${count} records...`}
    />
  );
};
