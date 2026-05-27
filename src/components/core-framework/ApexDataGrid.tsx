// ApexDataGrid.tsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { DataGridProps, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress, Button, useTheme } from "@mui/material";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ApexToolTip from "./ApexToolTip";
import ApexPagination from "./ApexPagination";

interface ApexDataGridProps extends Omit<DataGridProps, "columns" | "rows" | "rowHeight"> {
  rows: any[];
  columns: GridColDef[];
  height?: number | string;
  width?: number | string;
  fontSize?: number | string;
  textColor?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  headerFontSize?: number | string;
  headerBorderColor?: string;
  oddRowColor?: string;
  evenRowColor?: string;
  showToolbar?: boolean;
  showExportButtons?: boolean;
  exportOptions?: "both" | "excel" | "pdf" | "none";
  exportScope?: "all" | "page";
  toolbarOptions?: React.ReactNode;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
  noRowsTemplate?: React.ReactNode;
  serverSide?: boolean;
  exportFileName?: string;
  rowPadding?: string | number;
  cellPadding?: string | number;
  headerPaddingX?: string | number;
  headerPaddingY?: string | number;
  rowHeight?: number | "auto";

  // pagination customization
  pageSizeOptions?: number[];
  paginationFontSize?: string | number;
  paginationFontColor?: string;
  pageShape?: "rectangle" | "circle" | "rounded";
  selectedColor?: string;
  selectedTextColor?: string;
}

const ApexDataGrid: React.FC<ApexDataGridProps> = ({
  rows,
  columns,
  height = 400,
  width = "100%",
  fontSize = "0.875rem",
  textColor,
  headerBgColor,
  headerTextColor,
  headerFontSize = "0.9rem",
  headerBorderColor,
  oddRowColor,
  evenRowColor,
  showToolbar = true,
  showExportButtons = true,
  exportOptions = "both",
  exportScope = "all",
  toolbarOptions,
  loading = false,
  loadingTemplate,
  noRowsTemplate,
  serverSide = false,
  exportFileName = "ApexDataGrid",
  rowPadding = "8px",
  cellPadding = "12px",
  headerPaddingX = "12px",
  headerPaddingY = "4px",
  rowHeight = 40,

  pageSizeOptions = [10, 25, 50, 100],
  paginationFontSize = "0.85rem",
  paginationFontColor,
  pageShape = "rounded",
  selectedColor,
  selectedTextColor = "#fff",

  ...rest
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const resolvedTextColor = textColor ?? theme.palette.text.primary;
  const resolvedHeaderBgColor = headerBgColor ?? (isDark ? theme.palette.grey[800] : theme.palette.grey[100]);
  const resolvedHeaderTextColor = headerTextColor ?? theme.palette.text.primary;
  const resolvedHeaderBorderColor = headerBorderColor ?? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)");
  const resolvedOddRowColor = oddRowColor ?? (isDark ? theme.palette.background.default : "#f9f9f9");
  const resolvedEvenRowColor = evenRowColor ?? (isDark ? theme.palette.background.paper : "#ffffff");
  const resolvedPaginationFontColor = paginationFontColor ?? theme.palette.text.secondary;
  const resolvedSelectedColor = selectedColor ?? theme.palette.primary.main;
  const rowHoverBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const disabledRowBg = isDark ? theme.palette.action.disabledBackground : "#eee";
  const disabledRowText = isDark ? theme.palette.text.disabled : "#999";

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: pageSizeOptions[0],
  });

  const { initialState: restInitialState, ...dataGridRest } = rest;

  const getRowsForExport = () => {
    if (exportScope === "page") {
      const start = paginationModel.page * paginationModel.pageSize;
      return rows.slice(start, start + paginationModel.pageSize);
    }
    return rows;
  };

  const exportExcel = () => {
    const rowsToExport = getRowsForExport();
    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };

  const exportPDF = () => {
    const rowsToExport = getRowsForExport();

    const estimatedTableWidth = columns.reduce((acc, col) => {
      if (typeof col.width === "number") return acc + col.width;
      if (typeof col.width === "string") {
        const parsed = parseFloat(col.width);
        if (!Number.isNaN(parsed)) return acc + parsed;
      }
      const label = String(col.headerName ?? col.field);
      return acc + Math.max(35, label.length * 4.5);
    }, 0);

    const doc = new jsPDF({
      orientation: estimatedTableWidth > 190 ? "landscape" : "portrait",
    });
    const tableColumn = columns.map((c) => c.headerName ?? c.field);
    const tableRows = rowsToExport.map((r) => columns.map((c) => r[c.field]));
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      tableWidth: "auto",
    });
    doc.save(`${exportFileName}.pdf`);
  };

  const isExcelExportVisible =
    showExportButtons && (exportOptions === "both" || exportOptions === "excel");
  const isPDFExportVisible =
    showExportButtons && (exportOptions === "both" || exportOptions === "pdf");

  const toolbarContent = showToolbar ? (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        p: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
        {isExcelExportVisible && (
          <Button
            variant="outlined"
            size="small"
            onClick={exportExcel}
            startIcon={<GridOnIcon />}
          >
            Export Excel
          </Button>
        )}
        {isPDFExportVisible && (
          <Button
            variant="outlined"
            size="small"
            onClick={exportPDF}
            startIcon={<PictureAsPdfIcon />}
          >
            Export PDF
          </Button>
        )}
        {toolbarOptions}
      </Box>
    </Box>
  ) : null;

  // Ensure each column has a stable header class and left-align by default
  const columnsWithHeaderClass: GridColDef[] = columns.map((col) => ({
    headerClassName: col.headerClassName ?? "apex-header",
    headerAlign: col.headerAlign ?? "left",
    align: col.align ?? "left",
    ...col,
  }));

  return (
    <div style={{ height, width, overflow: "auto" }}>
      {toolbarContent}
      <DataGrid
        rows={rows}
        columns={columnsWithHeaderClass.map((col) => ({
          ...col,
          renderCell: col.renderCell
            ? col.renderCell
            : (params) => {
                const value = params.value ?? "";
                if (value === "") return "";
                return (
                  <ApexToolTip title={String(value)}>
                    <span
                      style={{
                        display: "block",
                        whiteSpace: rowHeight === "auto" ? "normal" : "nowrap",
                        wordBreak: rowHeight === "auto" ? "break-word" : "normal",
                        overflow: "hidden",
                        textOverflow: rowHeight === "auto" ? "clip" : "ellipsis",
                        fontWeight: 400,
                        color: resolvedTextColor,
                      }}
                    >
                      {String(value)}
                    </span>
                  </ApexToolTip>
                );
              },
        }))}
        loading={loading}
        pagination
        pageSizeOptions={pageSizeOptions}
        initialState={{
          pagination: { paginationModel: { pageSize: pageSizeOptions[0] } },
          ...restInitialState,
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        slots={{
          pagination: () => (
            <ApexPagination
              pageSizeOptions={pageSizeOptions}
              fontSize={paginationFontSize}
              fontColor={resolvedPaginationFontColor}
              pageShape={pageShape}
              selectedColor={resolvedSelectedColor}
              selectedTextColor={selectedTextColor}
            />
          ),
          loadingOverlay: () =>
            loadingTemplate || (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                  color: "text.secondary",
                }}
              >
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading data...</Typography>
              </Box>
            ),
          noRowsOverlay: () =>
            noRowsTemplate || (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6">🚫 No records found</Typography>
                <Typography variant="body2">Try adjusting filters or reload.</Typography>
              </Box>
            ),
        }}
        rowHeight={typeof rowHeight === "number" ? rowHeight : undefined}
        getRowHeight={rowHeight === "auto" ? () => "auto" : undefined}
        {...(serverSide
          ? {
              paginationMode: "server",
              sortingMode: "server",
              filterMode: "server",
            }
          : {})}
        {...dataGridRest}
        sx={{
          border: "none",

          // ── Cells ──────────────────────────────────────────────────────
          "& .MuiDataGrid-row": { minHeight: "unset" },
          "& .MuiDataGrid-cell": {
            px: typeof cellPadding === "number" ? `${cellPadding}px` : cellPadding,
            py: typeof rowPadding === "number" ? `${rowPadding}px` : rowPadding,
            fontSize,
            color: resolvedTextColor,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          // ── Column header wrapper ───────────────────────────────────────
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: `${resolvedHeaderBgColor} !important`,
            borderBottom: `2px solid ${resolvedHeaderBorderColor}`,
            minHeight: "unset !important",
          },

          // ── Individual header cell ──────────────────────────────────────
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: `${resolvedHeaderBgColor} !important`,
            color: `${resolvedHeaderTextColor} !important`,
            px: typeof headerPaddingX === "number" ? `${headerPaddingX}px` : headerPaddingX,
            py: typeof headerPaddingY === "number" ? `${headerPaddingY}px` : headerPaddingY,
            borderRight: `1px solid ${resolvedHeaderBorderColor}`,
            "&:focus, &:focus-within": { outline: "none" },
            "&:hover": { backgroundColor: `${resolvedHeaderBgColor} !important` },
          },

          // ── Header title ───────────────────────────────────────────────
          "& .MuiDataGrid-columnHeaderTitle": {
            color: `${resolvedHeaderTextColor} !important`,
            fontSize: headerFontSize,
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },

          // ── Header title + icons: title left, icons always at right end ──
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            display: "flex",
            alignItems: "center",
            width: "100%",
          },
          "& .MuiDataGrid-columnHeaderTitleContainerContent": {
            flex: 1,
            overflow: "hidden",
          },
          // ── Sort & filter icons — always visible, correct color on any theme ──
          "& .MuiDataGrid-iconButtonContainer": {
            visibility: "visible !important",
            opacity: "1 !important",
            marginLeft: "auto",
            flexShrink: 0,
            "& .MuiIconButton-root": {
              color: `${resolvedHeaderTextColor} !important`,
              opacity: "1 !important",
              padding: "2px",
              "&:hover": { backgroundColor: "rgba(128,128,128,0.2)" },
            },
            "& svg": {
              fill: `${resolvedHeaderTextColor} !important`,
              color: `${resolvedHeaderTextColor} !important`,
              opacity: "1 !important",
            },
          },
          "& .MuiDataGrid-sortIcon": {
            color: `${resolvedHeaderTextColor} !important`,
            fill: `${resolvedHeaderTextColor} !important`,
            opacity: "1 !important",
          },
          "& .MuiDataGrid-filterIcon": {
            color: `${resolvedHeaderTextColor} !important`,
            fill: `${resolvedHeaderTextColor} !important`,
            opacity: "1 !important",
          },
          "& .MuiDataGrid-menuIcon": {
            visibility: "visible !important",
            opacity: "1 !important",
            "& .MuiButtonBase-root": {
              color: `${resolvedHeaderTextColor} !important`,
              opacity: "1 !important",
            },
            "& svg": {
              fill: `${resolvedHeaderTextColor} !important`,
              color: `${resolvedHeaderTextColor} !important`,
            },
          },
          "& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon": {
            opacity: "1 !important",
          },

          // ── Row striping ────────────────────────────────────────────────
          "& .even-row": { backgroundColor: `${resolvedEvenRowColor} !important` },
          "& .odd-row": { backgroundColor: `${resolvedOddRowColor} !important` },
          "& .disabled-row": {
            backgroundColor: `${disabledRowBg} !important`,
            color: `${disabledRowText} !important`,
            pointerEvents: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: `${rowHoverBg} !important`,
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(25,118,210,0.08) !important",
          },

          // ── Footer / pagination area ────────────────────────────────────
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid",
            borderColor: "divider",
          },
        }}
        getRowClassName={(params) =>
          params.row.disabled
            ? "disabled-row"
            : params.indexRelativeToCurrentPage % 2 === 0
            ? "even-row"
            : "odd-row"
        }
      />
    </div>
  );
};

export default ApexDataGrid;
