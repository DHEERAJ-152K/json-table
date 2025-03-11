import React, { useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Avatar, Chip, TextField, MenuItem, Select, Button, Box } from "@mui/material";
import { debounce } from "lodash";
import tableData from "./data";

const tableSchema = [
  { accessorKey: "name", header: "Name", type: "avatar" },
  { accessorKey: "age", header: "Age", enableSorting: true },
  { accessorKey: "status", header: "Status", type: "badge" },
  { accessorKey: "role", header: "Role" },
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
      tableSchema.map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        enableColumnActions: false,
        enableSorting: col.enableSorting || false,
        size: 130,
        minSize: 100,
        maxSize: 200,
        flexGrow: 1,
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
          if (col.type === "badge") return <Chip label={value} color="primary" size="small" />;
          if (col.type === "badges")
            return (
              <Box display="flex" gap={1}>
                {value.map((team, index) => (
                  <Chip key={index} label={team} color="primary" size="small" />
                ))}
              </Box>
            );
          return value;
        },
      })),
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
          size="small"
        >
          <MenuItem disabled value="All Roles">All Roles</MenuItem>
          {[...new Set(tableData.map((item) => item.role))].map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
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
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          Prev
        </Button>

        <Box display="flex" gap={1}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "contained" : "outlined"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
        
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default JsonDrivenTable;