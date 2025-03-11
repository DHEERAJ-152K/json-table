import React, { useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Avatar, Chip, TextField, MenuItem, Select, Button, Box, Radio } from "@mui/material";
import { debounce } from "lodash";
import tableData from "./data";

const tableSchema = [
  { accessorKey: "name", header: "Name", type: "avatar" },
  { accessorKey: "age", header: "Age", enableSorting: true },
  { accessorKey: "status", header: "Status", type: "badge" },
  { accessorKey: "role", header: "Role", enableFilter: true },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "teams", header: "Teams", type: "badges" },
];

const ITEMS_PER_PAGE = 5; //numer of user per page

const JsonDrivenTable = () => {
  const [filters, setFilters] = useState({ name: "", role: [] });
  const [currentPage, setCurrentPage] = useState(1);

  //handles the name filter
  const handleNameFilterChange = debounce((value) => {
    setFilters((prev) => ({ ...prev, name: value }));
    setCurrentPage(1);
  }, 500);

  //handler for role filter
  const handleRoleFilterChange = (event) => {
    const selectedValues = event.target.value.filter((val) => val !== "All Roles");
    setFilters((prev) => ({ ...prev, role: selectedValues.length > 0 ? selectedValues : [] }));
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return tableData
      .filter((row) => row.name.username.toLowerCase().includes(filters.name.toLowerCase()))
      .filter((row) => filters.role.length === 0 || filters.role.includes(row.role));
  }, [filters]);

  //Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const displayedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = useMemo(
    () =>
    [
      ...tableSchema.map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        enableColumnActions: false,
        enableSorting: col.enableSorting || false,
        size: "auto", 
        minSize: 50, 
        maxSize: 400,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          if (col.type === "avatar") {
            return (
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={value.avatar} alt={value.username} />
                <Box>
                  <strong>{value.username}</strong>
                  <div style={{ fontSize: "0.8em", color: "gray" }}>{value.handle}</div>
                </Box>
              </Box>
            );
          }
          if (col.type === "badge")
            return <Chip label={value} color="primary" size="small" sx={{ background: "rgba(0, 123, 255, 0.21)", color: "rgba(0, 123, 255, 0.78)", font: "bold" }} />;
          if (col.type === "badges")
            return (
              <Box display="flex" gap={1}>
                {value.slice(0, 4).map((team, index) => (
                  <Chip
                    key={index}
                    label={team}
                    color="primary"
                    size="small"
                    sx={{ background: "rgba(0, 123, 255, 0.57)", color: "rgba(4, 5, 5, 0.91)" }}
                  />
                ))}
                {value.length > 3 && (
                  <Chip
                    label="5+"
                    size="small"
                    sx={{ backgroundColor: "rgba(206, 206, 206, 0.57) ", color: "black" }}
                  />
                )}
              </Box>
            );
          return value;
        },
      })),
      {
        accessorKey: "actions",
        header: "",
        enableColumnActions: false,
        enableSorting: false,
        size: 100,
        Cell: () => (
          <Box display="flex" alignItems="center" gap={1} justifyContent="center">
            <Radio size="small" />
            <Radio size="small" />
          </Box>
        ),
      },
    ],
    []
  );
  

  return (
    <Box>
      {/* name and role filters  */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Filter by Name"
          variant="outlined"
          size="small"
          onChange={(e) => handleNameFilterChange(e.target.value)}
        />
        <Select
          multiple
          displayEmpty
          value={filters.role.length > 0 ? filters.role : ["All Roles"]}
          onChange={handleRoleFilterChange}
          size="small">
          <MenuItem disabled value="All Roles">
            All Roles
          </MenuItem>
          {[...new Set(tableData.map((item) => item.role))].map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* table container  */}
      <MaterialReactTable
        columns={columns}
        data={displayedData}
        enableSorting
        enableRowSelection
        enablePagination={false}
        enableToolbarInternalActions={false}
        enableTopToolbar={false}
        muiTableContainerProps={{ sx: { maxWidth: "100%", overflowX: "auto" } }}
      />

      {/* pagination layout  */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          color="neutral"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}>
          <Radio color="neutral" orientation="vertical" size="sm" variant="outlined" />
          Prev
        </Button>
        <Box display="flex" gap={1}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant="soft"
              onClick={() => setCurrentPage(i + 1)}
              sx={{
                backgroundColor: currentPage === i + 1 ? "rgba(0, 123, 255, 0.1)" : "transparent", // Active button color
                color: currentPage === i + 1 ? "blue" : "black", // Text color
                border: "none",
                "&:hover": {
                  backgroundColor: "rgba(0, 123, 255, 0.1)",
                },
              }}>
              {i + 1}
            </Button>
          ))}
        </Box>

        <Button
          color="neutral"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
          <Radio color="neutral" orientation="vertical" size="sm" variant="outlined" />
        </Button>
      </Box>
    </Box>
  );
};

export default JsonDrivenTable;
