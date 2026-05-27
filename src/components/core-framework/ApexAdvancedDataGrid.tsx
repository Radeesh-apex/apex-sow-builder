import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TextField,
  InputAdornment,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Select,
  FormControl,
  useTheme,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Column definition ───────────────────────────────────────────────────────

export interface AdvancedColDef {
  field: string;
  headerName?: string;
  width?: number;
  flex?: number;
  group?: string;
  headerAlign?: "left" | "center" | "right";
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  renderHeader?: (col: AdvancedColDef) => React.ReactNode;
  renderCell?: (value: any, row: any) => React.ReactNode;
  valueFormatter?: (value: any) => string;
}

// ─── Column group definition ─────────────────────────────────────────────────

export interface ColumnGroup {
  id: string;
  label: string;
  fields: string[];
  headerBgColor?: string;
  headerTextColor?: string;
  collapsible?: boolean;
}

// ─── Row shape ────────────────────────────────────────────────────────────────

export interface AdvancedRow {
  id: string | number;
  [key: string]: any;
  children?: AdvancedRow[];
  _level?: number;
}

// ─── Context menu item ────────────────────────────────────────────────────────

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: AdvancedRow) => void;
  divider?: boolean;
}

// ─── View types ───────────────────────────────────────────────────────────────

export type ViewType = "grid" | "card";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ApexAdvancedDataGridProps {
  rows: AdvancedRow[];
  columns: AdvancedColDef[];
  columnGroups?: ColumnGroup[];
  viewType?: ViewType;
  allowViewSwitch?: boolean;
  height?: number | string;
  headerBgColor?: string;
  headerTextColor?: string;
  oddRowColor?: string;
  evenRowColor?: string;
  rowHeight?: number;
  headerRowTemplate?: (col: AdvancedColDef, group?: ColumnGroup) => React.ReactNode;
  rowTemplate?: (row: AdvancedRow, columns: AdvancedColDef[]) => React.ReactNode;
  cardTemplate?: (row: AdvancedRow) => React.ReactNode;
  footerTemplate?: React.ReactNode;
  expandable?: boolean;
  toolbar?: React.ReactNode;
  showSearch?: boolean;
  showExport?: boolean;
  exportFileName?: string;
  /** Show per-column filter inputs below the header row */
  showColumnFilters?: boolean;
  /** Enable row checkbox selection */
  selectable?: boolean;
  /** Controlled selected row ids */
  selectedRows?: (string | number)[];
  /** Called whenever selection changes */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /** Return menu items for a row; triggers a ⋮ button on each row */
  rowContextMenu?: (row: AdvancedRow) => ContextMenuItem[];
  /** Which export formats to show: 'both' (default), 'excel', or 'pdf' */
  exportOptions?: "excel" | "pdf" | "both";
  /** Rows per page — enables the built-in pagination bar when set */
  pageSize?: number;
  /** Options shown in the rows-per-page selector (default [5, 10, 25, 50]) */
  pageSizeOptions?: number[];
  sx?: object;
}

// ─── Default card render ─────────────────────────────────────────────────────

function DefaultCard({ row, columns }: { row: AdvancedRow; columns: AdvancedColDef[] }) {
  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
      {columns.map((col) => {
        const value = row[col.field];
        const display = col.valueFormatter ? col.valueFormatter(value) : value;
        const cell = col.renderCell ? col.renderCell(value, row) : display;
        return (
          <Box key={col.field} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80, flexShrink: 0 }}>
              {col.headerName ?? col.field}
            </Typography>
            {col.renderCell
              ? (cell ?? "—")
              : <Typography variant="body2">{cell ?? "—"}</Typography>}
          </Box>
        );
      })}
    </Paper>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const ApexAdvancedDataGrid: React.FC<ApexAdvancedDataGridProps> = ({
  rows,
  columns,
  columnGroups,
  viewType: externalViewType,
  allowViewSwitch = true,
  height = 500,
  headerBgColor,
  headerTextColor,
  oddRowColor,
  evenRowColor,
  rowHeight = 44,
  headerRowTemplate,
  rowTemplate,
  cardTemplate,
  footerTemplate,
  expandable = false,
  toolbar,
  showSearch = false,
  showExport = false,
  exportFileName = "ApexAdvancedDataGrid",
  exportOptions = "both",
  showColumnFilters = false,
  selectable = false,
  selectedRows: selectedRowsProp,
  onSelectionChange,
  rowContextMenu,
  pageSize,
  pageSizeOptions,
  sx = {},
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const resolvedHeaderBgColor = headerBgColor ?? (isDark ? theme.palette.grey[800] : theme.palette.grey[100]);
  const resolvedHeaderTextColor = headerTextColor ?? theme.palette.text.primary;
  const resolvedOddRowColor = oddRowColor ?? (isDark ? theme.palette.background.default : "#f9f9f9");
  const resolvedEvenRowColor = evenRowColor ?? (isDark ? theme.palette.background.paper : "#ffffff");
  const rowBorderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const headerBorderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const groupBorderColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const midBorderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const rowHoverColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  const [viewType, setViewType] = useState<ViewType>(externalViewType ?? "grid");
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [internalSelected, setInternalSelected] = useState<Set<string | number>>(new Set());
  const [ctxAnchor, setCtxAnchor] = useState<HTMLElement | null>(null);
  const [ctxRow, setCtxRow] = useState<AdvancedRow | null>(null);
  const ctxButtonRef = useRef<HTMLButtonElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize ?? 10);
  const resolvedPageSizeOptions = pageSizeOptions ?? [5, 10, 25, 50];

  const effectiveSelected: Set<string | number> =
    selectedRowsProp !== undefined ? new Set(selectedRowsProp) : internalSelected;

  const updateSelection = (newSet: Set<string | number>) => {
    if (selectedRowsProp === undefined) setInternalSelected(newSet);
    onSelectionChange?.(Array.from(newSet));
  };

  const toggleExpanded = (id: string | number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId); else next.add(groupId);
      return next;
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const setColumnFilter = (field: string, value: string) => {
    setColumnFilters((prev) => {
      if (!value) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: value };
    });
  };

  // ── Groups map ──────────────────────────────────────────────────────────────
  const groupByField = useMemo(() => {
    const map: Record<string, ColumnGroup> = {};
    if (columnGroups) {
      for (const grp of columnGroups) {
        for (const field of grp.fields) map[field] = grp;
      }
    }
    return map;
  }, [columnGroups]);

  // ── Visible columns ──────────────────────────────────────────────────────────
  const visibleColumns = useMemo(() => {
    if (!columnGroups || collapsedGroups.size === 0) return columns;
    return columns.filter((col) => {
      const grp = groupByField[col.field];
      if (!grp) return true;
      if (!collapsedGroups.has(grp.id)) return true;
      return grp.fields.indexOf(col.field) === 0;
    });
  }, [columns, columnGroups, groupByField, collapsedGroups]);

  // ── Flat rows ────────────────────────────────────────────────────────────────
  const flatRows = useMemo<AdvancedRow[]>(() => {
    if (!expandable) return rows.map((r) => ({ ...r, _level: 0 }));
    const result: AdvancedRow[] = [];
    const add = (list: AdvancedRow[], level: number) => {
      for (const row of list) {
        result.push({ ...row, _level: level });
        if (row.children && row.children.length > 0 && expandedIds.has(row.id)) {
          add(row.children, level + 1);
        }
      }
    };
    add(rows, 0);
    return result;
  }, [rows, expandedIds, expandable]);

  // ── Sort ─────────────────────────────────────────────────────────────────────
  const sortedRows = useMemo(() => {
    if (!sortField) return flatRows;
    return [...flatRows].sort((a, b) => {
      const col = columns.find((c) => c.field === sortField);
      const aRaw = a[sortField];
      const bRaw = b[sortField];
      const aVal = col?.valueFormatter ? col.valueFormatter(aRaw) : aRaw;
      const bVal = col?.valueFormatter ? col.valueFormatter(bRaw) : bRaw;
      let cmp = 0;
      if (typeof aRaw === "number" && typeof bRaw === "number") {
        cmp = aRaw - bRaw;
      } else {
        cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [flatRows, sortField, sortDir, columns]);

  // ── Filter (global + per-column) ─────────────────────────────────────────────
  const visibleRows = useMemo(() => {
    let result = sortedRows;
    if (filterText.trim()) {
      const lower = filterText.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const raw = row[col.field];
          const val = col.valueFormatter ? col.valueFormatter(raw) : raw;
          return String(val ?? "").toLowerCase().includes(lower);
        }),
      );
    }
    for (const [field, fv] of Object.entries(columnFilters)) {
      if (!fv.trim()) continue;
      const lower = fv.toLowerCase();
      const col = columns.find((c) => c.field === field);
      result = result.filter((row) => {
        const raw = row[field];
        const val = col?.valueFormatter ? col.valueFormatter(raw) : raw;
        return String(val ?? "").toLowerCase().includes(lower);
      });
    }
    return result;
  }, [sortedRows, filterText, columns, columnFilters]);

  useEffect(() => { setCurrentPage(0); }, [filterText, columnFilters]);

  const displayRows = useMemo(() => {
    if (pageSize === undefined) return visibleRows;
    const start = currentPage * rowsPerPage;
    return visibleRows.slice(start, start + rowsPerPage);
  }, [visibleRows, pageSize, currentPage, rowsPerPage]);

  // ── Export ──────────────────────────────────────────────────────────────────
  const exportExcel = () => {
    const data = visibleRows.map((row) =>
      Object.fromEntries(
        columns.map((col) => [
          col.headerName ?? col.field,
          col.valueFormatter ? col.valueFormatter(row[col.field]) : row[col.field],
        ]),
      ),
    );
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  };

  const exportPDF = () => {
    const headers = columns.map((c) => c.headerName ?? c.field);
    const body = visibleRows.map((row) =>
      columns.map((col) =>
        col.valueFormatter ? col.valueFormatter(row[col.field]) : String(row[col.field] ?? ""),
      ),
    );
    const doc = new jsPDF({ orientation: headers.length > 6 ? "landscape" : "portrait" });
    autoTable(doc, { head: [headers], body, styles: { fontSize: 8 } });
    doc.save(`${exportFileName}.pdf`);
  };

  const allVisibleSelected =
    displayRows.length > 0 && displayRows.every((r) => effectiveSelected.has(r.id));
  const someVisibleSelected =
    displayRows.some((r) => effectiveSelected.has(r.id)) && !allVisibleSelected;

  const handleSelectAll = (checked: boolean) => {
    const next = new Set(effectiveSelected);
    if (checked) {
      displayRows.forEach((r) => next.add(r.id));
    } else {
      displayRows.forEach((r) => next.delete(r.id));
    }
    updateSelection(next);
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const next = new Set(effectiveSelected);
    if (checked) next.add(id); else next.delete(id);
    updateSelection(next);
  };

  const openContextMenu = (e: React.MouseEvent<HTMLButtonElement>, row: AdvancedRow) => {
    e.stopPropagation();
    ctxButtonRef.current = e.currentTarget;
    setCtxRow(row);
    setCtxAnchor(e.currentTarget);
  };

  const closeContextMenu = () => {
    setCtxAnchor(null);
    setCtxRow(null);
  };

  const totalWidth = visibleColumns.reduce((acc, col) => acc + (col.width ?? 120), 0);
  const checkboxColWidth = 48;
  const actionsColWidth = 44;

  // ─── Grid view ──────────────────────────────────────────────────────────────
  const renderGrid = () => (
    <Box sx={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
      <Box sx={{ minWidth: totalWidth + (selectable ? checkboxColWidth : 0) + (rowContextMenu ? actionsColWidth : 0) }}>

        {/* Group header row */}
        {columnGroups && columnGroups.length > 0 && (
          <Box sx={{ display: "flex", bgcolor: resolvedHeaderBgColor }}>
            {expandable && <Box sx={{ width: 36, flexShrink: 0 }} />}
            {selectable && <Box sx={{ width: checkboxColWidth, flexShrink: 0 }} />}
            {(() => {
              const rendered: React.ReactNode[] = [];
              const seen = new Set<string>();
              for (const col of visibleColumns) {
                const grp = groupByField[col.field];
                if (grp && !seen.has(grp.id)) {
                  seen.add(grp.id);
                  const grpCols = visibleColumns.filter((c) => groupByField[c.field]?.id === grp.id);
                  const collapsed = collapsedGroups.has(grp.id);
                  const grpWidth = collapsed
                    ? (grpCols[0]?.width ?? 120)
                    : grpCols.reduce((a, c) => a + (c.width ?? 120), 0);
                  rendered.push(
                    <Box
                      key={grp.id}
                      onClick={() => (grp.collapsible !== false ? toggleGroupCollapse(grp.id) : undefined)}
                      sx={{
                        width: grpWidth, flexShrink: 0,
                        px: "6px", py: "3px",
                        borderRight: `1px solid ${groupBorderColor}`,
                        borderBottom: `1px solid ${groupBorderColor}`,
                        bgcolor: grp.headerBgColor ?? resolvedHeaderBgColor,
                        color: grp.headerTextColor ?? resolvedHeaderTextColor,
                        textAlign: "center",
                        fontSize: "0.75rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5,
                        cursor: grp.collapsible !== false ? "pointer" : "default",
                        userSelect: "none",
                        "&:hover": grp.collapsible !== false ? { opacity: 0.85 } : {},
                      }}
                    >
                      {grp.label}
                      {grp.collapsible !== false && (
                        <ChevronRightIcon
                          fontSize="inherit"
                          sx={{ transition: "transform 0.15s", transform: collapsed ? "rotate(0deg)" : "rotate(90deg)" }}
                        />
                      )}
                    </Box>,
                  );
                } else if (!grp) {
                  rendered.push(
                    <Box
                      key={col.field}
                      sx={{
                        width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                        px: "4px", py: "3px",
                        borderRight: `1px solid ${headerBorderColor}`,
                        borderBottom: `1px solid ${headerBorderColor}`,
                      }}
                    />,
                  );
                }
              }
              if (rowContextMenu) rendered.push(<Box key="__actions__" sx={{ width: actionsColWidth, flexShrink: 0 }} />);
              return rendered;
            })()}
          </Box>
        )}

        {/* Column header row */}
        <Box
          sx={{
            display: "flex",
            bgcolor: resolvedHeaderBgColor,
            color: resolvedHeaderTextColor,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {expandable && <Box sx={{ width: 36, flexShrink: 0 }} />}
          {selectable && (
            <Box sx={{ width: checkboxColWidth, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Checkbox
                size="small"
                checked={allVisibleSelected}
                indeterminate={someVisibleSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                sx={{ color: resolvedHeaderTextColor, "&.Mui-checked": { color: resolvedHeaderTextColor }, "&.MuiCheckbox-indeterminate": { color: resolvedHeaderTextColor }, p: "4px" }}
              />
            </Box>
          )}
          {visibleColumns.map((col) => {
            const isSorted = sortField === col.field;
            const sortable = col.sortable !== false;
            const headerContent = headerRowTemplate
              ? headerRowTemplate(col, groupByField[col.field])
              : col.renderHeader
              ? col.renderHeader(col)
              : col.headerName ?? col.field;

            return (
              <Box
                key={col.field}
                onClick={() => sortable && handleSort(col.field)}
                sx={{
                  width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                  px: "8px", py: "6px",
                  borderRight: `1px solid ${midBorderColor}`,
                  borderBottom: `2px solid ${groupBorderColor}`,
                  display: "flex", alignItems: "center",
                  justifyContent: col.headerAlign === "center" ? "center" : col.headerAlign === "right" ? "flex-end" : "space-between",
                  cursor: sortable ? "pointer" : "default",
                  userSelect: "none",
                  "&:hover": sortable ? { bgcolor: rowBorderColor } : {},
                  overflow: "hidden", gap: 0.5,
                }}
              >
                <Typography variant="caption" fontWeight={700} noWrap sx={{ color: resolvedHeaderTextColor, lineHeight: 1.4, flex: 1 }}>
                  {headerContent}
                </Typography>
                {sortable && (
                  <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: resolvedHeaderTextColor }}>
                    {isSorted ? (
                      sortDir === "asc" ? <ArrowUpwardIcon sx={{ fontSize: "0.85rem" }} /> : <ArrowDownwardIcon sx={{ fontSize: "0.85rem" }} />
                    ) : (
                      <ArrowUpwardIcon sx={{ fontSize: "0.85rem", opacity: 0.3 }} />
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
          {rowContextMenu && <Box sx={{ width: actionsColWidth, flexShrink: 0 }} />}
        </Box>

        {/* Per-column filter row */}
        {showColumnFilters && (
          <Box
            sx={{
              display: "flex",
              bgcolor: "background.paper",
              borderBottom: `1px solid ${midBorderColor}`,
              position: "sticky",
              top: 44,
              zIndex: 1,
            }}
          >
            {expandable && <Box sx={{ width: 36, flexShrink: 0 }} />}
            {selectable && <Box sx={{ width: checkboxColWidth, flexShrink: 0 }} />}
            {visibleColumns.map((col) => (
              <Box
                key={col.field}
                sx={{
                  width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                  px: "4px", py: "3px",
                  borderRight: `1px solid ${rowBorderColor}`,
                }}
              >
                <TextField
                  size="small"
                  value={columnFilters[col.field] ?? ""}
                  onChange={(e) => setColumnFilter(col.field, e.target.value)}
                  placeholder="Filter…"
                  variant="standard"
                  InputProps={{
                    disableUnderline: false,
                    endAdornment: columnFilters[col.field] ? (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setColumnFilter(col.field, "")}>
                          <ClearIcon sx={{ fontSize: "0.7rem" }} />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  }}
                  sx={{ width: "100%", "& .MuiInputBase-input": { fontSize: "0.72rem", py: "2px" } }}
                />
              </Box>
            ))}
            {rowContextMenu && <Box sx={{ width: actionsColWidth, flexShrink: 0 }} />}
          </Box>
        )}

        {/* Data rows */}
        {displayRows.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">No records found</Typography>
          </Box>
        ) : (
          displayRows.map((row, idx) => {
            const isEven = idx % 2 === 0;
            const hasChildren = row.children && row.children.length > 0;
            const isExpanded = expandedIds.has(row.id);
            const indent = (row._level ?? 0) * 24;
            const isSelected = effectiveSelected.has(row.id);

            if (rowTemplate) {
              return (
                <Box
                  key={row.id}
                  sx={{ bgcolor: isSelected ? "action.selected" : isEven ? resolvedEvenRowColor : resolvedOddRowColor, borderBottom: `1px solid ${rowBorderColor}` }}
                >
                  {rowTemplate(row, visibleColumns)}
                </Box>
              );
            }

            return (
              <Box
                key={row.id}
                sx={{
                  display: "flex",
                  bgcolor: isSelected ? "action.selected" : isEven ? resolvedEvenRowColor : resolvedOddRowColor,
                  borderBottom: `1px solid ${rowBorderColor}`,
                  minHeight: rowHeight,
                  alignItems: "center",
                  "&:hover": { bgcolor: isSelected ? "action.selected" : rowHoverColor },
                }}
              >
                {expandable && (
                  <Box sx={{ width: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {hasChildren && (
                      <IconButton size="small" onClick={() => toggleExpanded(row.id)}>
                        {isExpanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                      </IconButton>
                    )}
                  </Box>
                )}
                {selectable && (
                  <Box sx={{ width: checkboxColWidth, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                      sx={{ p: "4px" }}
                    />
                  </Box>
                )}
                {visibleColumns.map((col) => {
                  const value = row[col.field];
                  const display = col.valueFormatter ? col.valueFormatter(value) : value;
                  const cell = col.renderCell ? col.renderCell(value, row) : display;

                  return (
                    <Box
                      key={col.field}
                      sx={{
                        width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                        px: "8px", py: "4px",
                        borderRight: `1px solid ${rowBorderColor}`,
                        display: "flex", alignItems: "center",
                        justifyContent: col.align === "center" ? "center" : col.align === "right" ? "flex-end" : "flex-start",
                        overflow: "hidden",
                        pl: col === visibleColumns[0] ? `${8 + indent}px` : "8px",
                      }}
                    >
                      {col.renderCell
                        ? (cell ?? "—")
                        : (
                          <Typography variant="body2" noWrap sx={{ fontSize: "0.85rem", width: "100%" }}>
                            {cell ?? "—"}
                          </Typography>
                        )}
                    </Box>
                  );
                })}
                {rowContextMenu && (
                  <Box sx={{ width: actionsColWidth, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Tooltip title="Actions">
                      <IconButton size="small" onClick={(e) => openContextMenu(e, row)}>
                        <MoreVertIcon sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );

  // ─── Card view ──────────────────────────────────────────────────────────────
  const renderCards = () => (
    <Box
      sx={{
        flex: 1, overflowY: "auto", p: 2,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 2, alignContent: "start",
      }}
    >
      {displayRows.map((row) =>
        cardTemplate ? (
          <Box key={row.id}>{cardTemplate(row)}</Box>
        ) : (
          <DefaultCard key={row.id} row={row} columns={visibleColumns} />
        ),
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        height, display: "flex", flexDirection: "column",
        border: "1px solid", borderColor: "divider",
        borderRadius: 1, overflow: "hidden", ...sx,
      }}
    >
      {/* Toolbar */}
      {(allowViewSwitch || toolbar || showSearch || showExport) && (
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1,
            px: 2, py: 1,
            borderBottom: "1px solid", borderColor: "divider",
            flexShrink: 0, bgcolor: "background.paper", flexWrap: "wrap",
          }}
        >
          {showSearch && (
            <TextField
              size="small"
              placeholder="Search…"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 180, "& .MuiInputBase-input": { fontSize: "0.8rem" } }}
            />
          )}

          <Box sx={{ flex: 1 }}>{toolbar}</Box>

          {showExport && (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {(exportOptions === "both" || exportOptions === "excel") && (
                <Tooltip title="Export Excel">
                  <IconButton size="small" onClick={exportExcel}>
                    <GridOnIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {(exportOptions === "both" || exportOptions === "pdf") && (
                <Tooltip title="Export PDF">
                  <IconButton size="small" onClick={exportPDF}>
                    <PictureAsPdfIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {allowViewSwitch && (
            <ToggleButtonGroup value={viewType} exclusive size="small" onChange={(_, v) => v && setViewType(v)}>
              <ToggleButton value="grid" aria-label="grid view">
                <Tooltip title="Grid view"><ViewListIcon fontSize="small" /></Tooltip>
              </ToggleButton>
              <ToggleButton value="card" aria-label="card view">
                <Tooltip title="Card view"><GridViewIcon fontSize="small" /></Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
      )}

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {viewType === "grid" ? renderGrid() : renderCards()}
      </Box>

      {/* Pagination bar */}
      {pageSize !== undefined && (
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1,
            borderTop: "1px solid", borderColor: "divider",
            px: 2, py: 0.75, flexShrink: 0,
            bgcolor: "background.paper", flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
            {visibleRows.length === 0
              ? "No rows"
              : `${currentPage * rowsPerPage + 1}–${Math.min((currentPage + 1) * rowsPerPage, visibleRows.length)} of ${visibleRows.length}`}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl size="small">
              <Select
                value={String(rowsPerPage)}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(0); }}
                sx={{ fontSize: "0.75rem", "& .MuiSelect-select": { py: "2px", px: "8px" } }}
              >
                {resolvedPageSizeOptions.map((s) => (
                  <MenuItem key={s} value={String(s)} sx={{ fontSize: "0.75rem" }}>{s} / page</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Pagination
              count={Math.ceil(visibleRows.length / rowsPerPage) || 1}
              page={currentPage + 1}
              onChange={(_, p) => setCurrentPage(p - 1)}
              size="small"
              showFirstButton
              showLastButton
              sx={{ "& .MuiPaginationItem-root": { fontSize: "0.7rem", minWidth: 28, height: 28 } }}
            />
          </Box>
        </Box>
      )}

      {/* Footer */}
      {footerTemplate && (
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
          {footerTemplate}
        </Box>
      )}

      {/* Context menu */}
      {rowContextMenu && (
        <Menu
          anchorEl={ctxAnchor}
          open={Boolean(ctxAnchor)}
          onClose={closeContextMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {ctxRow &&
            rowContextMenu(ctxRow).map((item, i) => (
              <MenuItem
                key={i}
                divider={item.divider}
                onClick={() => { item.onClick(ctxRow); closeContextMenu(); }}
                dense
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                )}
                <ListItemText primaryTypographyProps={{ fontSize: "0.85rem" }}>
                  {item.label}
                </ListItemText>
              </MenuItem>
            ))}
        </Menu>
      )}
    </Box>
  );
};

export default ApexAdvancedDataGrid;
