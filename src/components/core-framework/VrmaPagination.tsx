// VrmaPagination.tsx
import React from "react";
import {
  Pagination,
  PaginationItem,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";

interface VrmaPaginationProps {
  pageSizeOptions?: number[];
  fontSize?: string | number;
  fontColor?: string;
  pageShape?: "rectangle" | "circle" | "rounded";
  selectedColor?: string;
  selectedTextColor?: string;
}

const VrmaPagination: React.FC<VrmaPaginationProps> = ({
  pageSizeOptions = [10, 25, 50, 100],
  fontSize = "0.85rem",
  fontColor = "#444",
  pageShape = "rounded",
  selectedColor = "#1976d2",
  selectedTextColor = "#fff",
}) => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector); // zero-based
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    apiRef.current.setPage(value - 1);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<string>) => {
    const newSize = Number(event.target.value);
    apiRef.current.setPageSize(newSize);
    apiRef.current.setPage(0);
  };

  const getShapeStyles = () => {
    switch (pageShape) {
      case "circle":
        return { borderRadius: "50%", minWidth: 36, height: 36 };
      case "rectangle":
        return { borderRadius: 0, minWidth: 40, height: 32 };
      case "rounded":
      default:
        return { borderRadius: "8px", minWidth: 36, height: 36 };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 1,
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "8px",
          px: 1.25,
          py: 0.5,
          backgroundColor: "transparent",
        }}
        aria-hidden
      >
        <Typography
          component="span"
          sx={{
            fontSize,
            color: fontColor,
            fontWeight: 500,
          }}
        >
          Page: {pageCount > 0 ? `${page + 1} / ${pageCount}` : "0 / 0"}
        </Typography>
      </Box>

      <FormControl size="small" sx={{ minWidth: 96 }}>
        <Select
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          displayEmpty
          inputProps={{ "aria-label": "rows per page" }}
          sx={{
            borderRadius: "8px",
            "& .MuiSelect-select": { py: 0.5, px: 1 },
            fontSize,
            color: fontColor,
          }}
        >
          {pageSizeOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={handleChange}
        variant="outlined"
        color="primary"
        showFirstButton
        showLastButton
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              ...getShapeStyles(),
              margin: "0 4px",
              fontSize,
              color: fontColor,
              "&.Mui-selected": {
                backgroundColor: selectedColor,
                color: selectedTextColor,
                borderColor: selectedColor,
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default VrmaPagination;
