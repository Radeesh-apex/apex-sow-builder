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
  Popover,
  Button,
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
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Multi-filter types ───────────────────────────────────────────────────────

// ─── Filter operator types per data type ─────────────────────────────────────

type StringOperator  = "contains" | "notContains" | "equals" | "notEquals" | "startsWith" | "endsWith" | "isEmpty" | "isNotEmpty";
type NumberOperator  = "=" | "!=" | "<" | ">" | "<=" | ">=" | "isEmpty" | "isNotEmpty";
type DateOperator    = "on" | "before" | "after" | "onOrBefore" | "onOrAfter" | "isEmpty" | "isNotEmpty";
type FilterOperator  = StringOperator | NumberOperator | DateOperator;

interface FilterCondition {
  id: string;
  operator: FilterOperator;
  value: string;
}

interface ColumnFilterState {
  logic: "AND" | "OR";
  conditions: FilterCondition[];
}

const STRING_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains",    label: "Contains" },
  { value: "notContains", label: "Does not contain" },
  { value: "equals",      label: "Equals" },
  { value: "notEquals",   label: "Not equals" },
  { value: "startsWith",  label: "Starts with" },
  { value: "endsWith",    label: "Ends with" },
  { value: "isEmpty",     label: "Is empty" },
  { value: "isNotEmpty",  label: "Is not empty" },
];

const NUMBER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "=",           label: "= Equals" },
  { value: "!=",          label: "≠ Not equals" },
  { value: "<",           label: "< Less than" },
  { value: ">",           label: "> Greater than" },
  { value: "<=",          label: "≤ Less than or equal" },
  { value: ">=",          label: "≥ Greater than or equal" },
  { value: "isEmpty",     label: "Is empty" },
  { value: "isNotEmpty",  label: "Is not empty" },
];

const DATE_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "on",         label: "On" },
  { value: "before",     label: "Before" },
  { value: "after",      label: "After" },
  { value: "onOrBefore", label: "On or before" },
  { value: "onOrAfter",  label: "On or after" },
  { value: "isEmpty",    label: "Is empty" },
  { value: "isNotEmpty", label: "Is not empty" },
];

function getColOperators(t: "string" | "number" | "date") {
  if (t === "number") return NUMBER_OPERATORS;
  if (t === "date")   return DATE_OPERATORS;
  return STRING_OPERATORS;
}

function defaultOperator(t: "string" | "number" | "date"): FilterOperator {
  if (t === "number") return "=";
  if (t === "date")   return "on";
  return "contains";
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

function FilterPanel({
  col,
  colType,
  anchorEl,
  filterState,
  onFilterChange,
  onClose,
}: {
  col: AdvancedColDef;
  colType: "string" | "number" | "date";
  anchorEl: HTMLElement | null;
  filterState: ColumnFilterState;
  onFilterChange: (s: ColumnFilterState) => void;
  onClose: () => void;
}) {
  const needsValue = (op: FilterOperator) => op !== "isEmpty" && op !== "isNotEmpty";
  const operators = getColOperators(colType);

  const addCondition = () => {
    if (filterState.conditions.length >= 5) return;
    onFilterChange({
      ...filterState,
      conditions: [
        ...filterState.conditions,
        { id: String(Date.now()), operator: defaultOperator(colType), value: "" },
      ],
    });
  };

  const removeCondition = (id: string) =>
    onFilterChange({
      ...filterState,
      conditions: filterState.conditions.filter((c) => c.id !== id),
    });

  const updateCondition = (id: string, patch: Partial<FilterCondition>) =>
    onFilterChange({
      ...filterState,
      conditions: filterState.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });

  const clearAll = () => { onFilterChange({ logic: "AND", conditions: [] }); onClose(); };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{ sx: { p: 2, minWidth: 340, maxWidth: 420 } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: "0.78rem" }}>
              Filter: {col.headerName ?? col.field}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem", ml: 1 }}>
              {colType}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ p: 0.25 }}>
            <CloseIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </Box>

        {/* AND / OR toggle (only when >1 condition) */}
        {filterState.conditions.length > 1 && (
          <ToggleButtonGroup
            value={filterState.logic}
            exclusive
            size="small"
            onChange={(_, v) => v && onFilterChange({ ...filterState, logic: v })}
            sx={{ "& .MuiToggleButton-root": { px: 2, py: 0.5, fontSize: "0.72rem", textTransform: "none" } }}
          >
            <ToggleButton value="AND">AND — all conditions must match</ToggleButton>
            <ToggleButton value="OR">OR — any condition matches</ToggleButton>
          </ToggleButtonGroup>
        )}

        {/* Conditions */}
        {filterState.conditions.map((cond, idx) => (
          <Box key={cond.id}>
            {idx > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem", mb: 0.5, display: "block" }}>
                {filterState.logic}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
              <Select
                size="small"
                value={cond.operator}
                onChange={(e) => updateCondition(cond.id, { operator: e.target.value as FilterOperator })}
                sx={{ fontSize: "0.72rem", "& .MuiSelect-select": { py: "4px" }, minWidth: 160 }}
              >
                {operators.map((op) => (
                  <MenuItem key={op.value} value={op.value} sx={{ fontSize: "0.72rem" }}>{op.label}</MenuItem>
                ))}
              </Select>
              {needsValue(cond.operator) && (
                <TextField
                  size="small"
                  type={colType === "date" ? "date" : "text"}
                  value={cond.value}
                  onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                  placeholder={colType === "number" ? "Number…" : colType === "date" ? undefined : "Value…"}
                  InputLabelProps={colType === "date" ? { shrink: true } : undefined}
                  sx={{ flex: 1, "& .MuiInputBase-input": { fontSize: "0.72rem", py: "4px" } }}
                />
              )}
              <IconButton size="small" onClick={() => removeCondition(cond.id)} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: "0.85rem" }} />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* Footer actions */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          {filterState.conditions.length < 5 && (
            <Button size="small" variant="outlined" onClick={addCondition} sx={{ fontSize: "0.72rem", py: 0.25, textTransform: "none" }}>
              + Add condition
            </Button>
          )}
          {filterState.conditions.length === 0 && (
            <Button size="small" variant="contained" onClick={addCondition} sx={{ fontSize: "0.72rem", py: 0.25, textTransform: "none" }}>
              Add condition
            </Button>
          )}
          {filterState.conditions.length > 0 && (
            <Button size="small" color="error" variant="text" onClick={clearAll} sx={{ fontSize: "0.72rem", py: 0.25, ml: "auto", textTransform: "none" }}>
              Clear all
            </Button>
          )}
        </Box>
      </Box>
    </Popover>
  );
}

// ─── Column type auto-detection ───────────────────────────────────────────────

function detectColType(
  col: AdvancedColDef | undefined,
  sampleRows: AdvancedRow[],
): "string" | "number" | "date" {
  if (col?.type) return col.type;
  for (const row of sampleRows.slice(0, 20)) {
    const val = row[col?.field ?? ""];
    if (val !== null && val !== undefined) {
      if (typeof val === "number") return "number";
      if (val instanceof Date)     return "date";
    }
  }
  return "string";
}

// ─── Column definition ───────────────────────────────────────────────────────

export interface AdvancedColDef {
  field: string;
  headerName?: string;
  /** Column width in pixels */
  width?: number;
  flex?: number;
  /** Allow this column to participate in drag-and-drop column grouping; default false */
  group?: boolean;
  headerAlign?: "left" | "center" | "right";
  align?: "left" | "center" | "right";
  /** Shorthand that sets both align and headerAlign; default "left" */
  textAlign?: "left" | "center" | "right";
  /** Data type — controls filter operators shown in the panel; auto-detected when omitted */
  type?: "string" | "number" | "date";
  /** Enable column sorting; default false */
  sort?: boolean;
  /** @deprecated Use sort instead */
  sortable?: boolean;
  /** Enable the per-column multi-filter panel; default false */
  filter?: boolean;
  /** @deprecated Use filter instead */
  filterable?: boolean;
  /** Show a ⋮ header menu with sort / hide-column options; default false */
  menu?: boolean;
  /** Background color applied to all cells in this column */
  colColor?: string;
  renderHeader?: (col: AdvancedColDef) => React.ReactNode;
  renderCell?: (value: any, row: any) => React.ReactNode;
  valueFormatter?: (value: any) => string;
  /** Whether this column can be edited inline when onRowSave is provided; default false */
  editable?: boolean;
  /** Mark as required during inline edit — save is blocked and error shown if the field is empty; default false */
  required?: boolean;
  /** @deprecated Use required instead */
  editRequired?: boolean;
  /** Custom validation error message; auto-generated from headerName/field when omitted */
  helperText?: string;
  /** Hide this column from the grid view; it is still included in exports; default true */
  visible?: boolean;
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

export interface VrmaAdvancedDataGridProps {
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
  /** When provided, adds an inline Edit button per row; called with the updated row on save */
  onRowSave?: (updatedRow: AdvancedRow) => void;
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

const VrmaAdvancedDataGrid: React.FC<VrmaAdvancedDataGridProps> = ({
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
  exportFileName = "VrmaAdvancedDataGrid",
  exportOptions = "both",
  showColumnFilters = false,
  selectable = false,
  selectedRows: selectedRowsProp,
  onSelectionChange,
  rowContextMenu,
  onRowSave,
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

  const [editingRowId, setEditingRowId] = useState<string | number | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({});
  const [editErrors, setEditErrors] = useState<Map<string, string>>(new Map());
  const editColWidth = 76;

  const [hiddenColFields, setHiddenColFields] = useState<Set<string>>(new Set());
  const [colMenuState, setColMenuState] = useState<{ anchor: HTMLElement; col: AdvancedColDef } | null>(null);

  const openColMenu = (e: React.MouseEvent<HTMLButtonElement>, col: AdvancedColDef) => {
    e.stopPropagation();
    setColMenuState({ anchor: e.currentTarget, col });
  };
  const closeColMenu = () => setColMenuState(null);

  // ── Multi-filter ─────────────────────────────────────────────────────────────
  const [multiFilters, setMultiFilters] = useState<Record<string, ColumnFilterState>>({});
  const [filterPanelAnchor, setFilterPanelAnchor] = useState<HTMLElement | null>(null);
  const [filterPanelField, setFilterPanelField] = useState<string | null>(null);

  const openFilterPanel = (e: React.MouseEvent<HTMLButtonElement>, field: string) => {
    e.stopPropagation();
    setFilterPanelAnchor(e.currentTarget);
    setFilterPanelField(field);
    if (!multiFilters[field]) {
      setMultiFilters((p) => ({ ...p, [field]: { logic: "AND", conditions: [] } }));
    }
  };
  const closeFilterPanel = () => { setFilterPanelAnchor(null); setFilterPanelField(null); };
  const setColMultiFilter = (field: string, state: ColumnFilterState) =>
    setMultiFilters((p) => ({ ...p, [field]: state }));

  const activeFilterCount = (field: string) =>
    (multiFilters[field]?.conditions ?? []).filter((c) =>
      c.operator === "isEmpty" || c.operator === "isNotEmpty" ? true : c.value.trim() !== ""
    ).length;

  // ── Drag-and-drop column grouping ─────────────────────────────────────────────
  const [dragField, setDragField] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);
  const [dynamicGroups, setDynamicGroups] = useState<ColumnGroup[]>([]);

  const GROUP_PALETTE = ["#1e3a5f", "#065f46", "#7c3aed", "#92400e", "#9f1239", "#0e7490"];

  const isInStaticGroup = (field: string) => (columnGroups ?? []).some((g) => g.fields.includes(field));

  const handleColDragStart = (e: React.DragEvent<HTMLDivElement>, field: string) => {
    if (isInStaticGroup(field)) { e.preventDefault(); return; }
    setDragField(field);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", field);
  };
  const handleColDragOver = (e: React.DragEvent<HTMLDivElement>, field: string) => {
    if (!dragField || dragField === field) return;
    if (isInStaticGroup(field)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverField(field);
  };
  const handleColDragLeave = () => setDragOverField(null);
  const handleColDragEnd = () => { setDragField(null); setDragOverField(null); };

  const handleColDrop = (e: React.DragEvent<HTMLDivElement>, targetField: string) => {
    e.preventDefault();
    if (!dragField || dragField === targetField || isInStaticGroup(targetField)) {
      setDragField(null); setDragOverField(null); return;
    }
    const allGroups = [...(columnGroups ?? []), ...dynamicGroups];
    const targetGroup = allGroups.find((g) => g.fields.includes(targetField));
    const dragGroup = dynamicGroups.find((g) => g.fields.includes(dragField));

    if (targetGroup && dynamicGroups.some((g) => g.id === targetGroup.id)) {
      // Add to existing dynamic group
      setDynamicGroups((prev) =>
        prev
          .map((g) =>
            g.id === targetGroup.id
              ? { ...g, fields: [...g.fields.filter((f) => f !== dragField), dragField] }
              : { ...g, fields: g.fields.filter((f) => f !== dragField) }
          )
          .filter((g) => g.fields.length >= 1)
      );
    } else {
      // Create new group from dragField + targetField
      const dragCol = columns.find((c) => c.field === dragField);
      const targetCol = columns.find((c) => c.field === targetField);
      const label = `${dragCol?.headerName ?? dragField} / ${targetCol?.headerName ?? targetField}`;
      const colorIdx = dynamicGroups.length % GROUP_PALETTE.length;
      const newGroup: ColumnGroup = {
        id: `dyn_${Date.now()}`,
        label,
        fields: [dragField, targetField],
        headerBgColor: GROUP_PALETTE[colorIdx],
        headerTextColor: "#fff",
        collapsible: true,
      };
      // Remove dragged field from its current dynamic group (if any)
      setDynamicGroups((prev) => [
        ...prev
          .map((g) => (g.id === dragGroup?.id ? { ...g, fields: g.fields.filter((f) => f !== dragField) } : g))
          .filter((g) => g.fields.length >= 1),
        newGroup,
      ]);
    }
    setDragField(null); setDragOverField(null);
  };

  const removeDynamicGroup = (groupId: string) =>
    setDynamicGroups((prev) => prev.filter((g) => g.id !== groupId));

  const startEdit = (row: AdvancedRow) => {
    setEditingRowId(row.id);
    setEditDraft({ ...row });
    setEditErrors(new Map());
  };
  const cancelEdit = () => { setEditingRowId(null); setEditDraft({}); setEditErrors(new Map()); };
  const commitEdit = () => {
    const errors = new Map<string, string>();
    for (const col of visibleColumns) {
      if (col.editable && (col.required || col.editRequired)) {
        const val = editDraft[col.field];
        if (val === undefined || val === null || String(val).trim() === "") {
          const name = col.headerName || col.field;
          const msg =
            col.helperText ||
            `The ${name.trim().charAt(0).toUpperCase() + name.trim().slice(1)} field is required`;
          errors.set(col.field, msg);
        }
      }
    }
    if (errors.size > 0) { setEditErrors(errors); return; }
    setEditErrors(new Map());
    onRowSave?.(editDraft as AdvancedRow);
    cancelEdit();
  };

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

  // ── Merge static + dynamic column groups ────────────────────────────────────
  const allColumnGroups = useMemo(
    () => [...(columnGroups ?? []), ...dynamicGroups],
    [columnGroups, dynamicGroups]
  );

  // ── Groups map ──────────────────────────────────────────────────────────────
  const groupByField = useMemo(() => {
    const map: Record<string, ColumnGroup> = {};
    for (const grp of allColumnGroups) {
      for (const field of grp.fields) map[field] = grp;
    }
    return map;
  }, [allColumnGroups]);

  // ── Visible columns (hides cols with visible===false or hidden via menu; still exported) ─────────
  const visibleColumns = useMemo(() => {
    const shown = columns.filter((col) => col.visible !== false && !hiddenColFields.has(col.field));
    if (!allColumnGroups.length || collapsedGroups.size === 0) return shown;
    return shown.filter((col) => {
      const grp = groupByField[col.field];
      if (!grp) return true;
      if (!collapsedGroups.has(grp.id)) return true;
      return grp.fields.indexOf(col.field) === 0;
    });
  }, [columns, allColumnGroups, groupByField, collapsedGroups, hiddenColFields]);

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

  // ── Filter (global + per-column + multi-filter) ──────────────────────────────
  const visibleRows = useMemo(() => {
    let result = sortedRows;

    // Global search
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

    // Simple per-column text filter (showColumnFilters row)
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

    // Advanced multi-filter (per-column, AND/OR logic, type-aware)
    for (const [field, filterGroup] of Object.entries(multiFilters)) {
      const activeConds = filterGroup.conditions.filter((c) =>
        c.operator === "isEmpty" || c.operator === "isNotEmpty" ? true : c.value.trim() !== ""
      );
      if (!activeConds.length) continue;
      const col = columns.find((c) => c.field === field);
      const colType = detectColType(col, rows);
      result = result.filter((row) => {
        const raw = row[field];
        const checks = activeConds.map((cond) => {
          if (cond.operator === "isEmpty")    return raw === null || raw === undefined || String(raw).trim() === "";
          if (cond.operator === "isNotEmpty") return raw !== null && raw !== undefined && String(raw).trim() !== "";

          if (colType === "number") {
            const numRaw = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
            const numCv  = parseFloat(cond.value);
            if (isNaN(numRaw) || isNaN(numCv)) return false;
            switch (cond.operator as NumberOperator) {
              case "=":  return numRaw === numCv;
              case "!=": return numRaw !== numCv;
              case "<":  return numRaw < numCv;
              case ">":  return numRaw > numCv;
              case "<=": return numRaw <= numCv;
              case ">=": return numRaw >= numCv;
              default:   return true;
            }
          }

          if (colType === "date") {
            const dRaw  = (raw instanceof Date ? raw : new Date(String(raw ?? ""))).getTime();
            const dCv   = new Date(cond.value).getTime();
            if (isNaN(dRaw) || isNaN(dCv)) return false;
            const dayRaw = new Date(dRaw).toISOString().slice(0, 10);
            const dayCv  = new Date(dCv).toISOString().slice(0, 10);
            switch (cond.operator as DateOperator) {
              case "on":         return dayRaw === dayCv;
              case "before":     return dayRaw <  dayCv;
              case "after":      return dayRaw >  dayCv;
              case "onOrBefore": return dayRaw <= dayCv;
              case "onOrAfter":  return dayRaw >= dayCv;
              default:           return true;
            }
          }

          // string type
          const val    = col?.valueFormatter ? col.valueFormatter(raw) : raw;
          const strVal = String(val ?? "").toLowerCase();
          const cv     = cond.value.toLowerCase();
          switch (cond.operator as StringOperator) {
            case "contains":    return strVal.includes(cv);
            case "notContains": return !strVal.includes(cv);
            case "equals":      return strVal === cv;
            case "notEquals":   return strVal !== cv;
            case "startsWith":  return strVal.startsWith(cv);
            case "endsWith":    return strVal.endsWith(cv);
            default:            return true;
          }
        });
        return filterGroup.logic === "AND" ? checks.every(Boolean) : checks.some(Boolean);
      });
    }

    return result;
  }, [sortedRows, filterText, columns, columnFilters, multiFilters]);

  useEffect(() => { setCurrentPage(0); }, [filterText, columnFilters, multiFilters]);

  const displayRows = useMemo(() => {
    if (pageSize === undefined) return visibleRows;
    const start = currentPage * rowsPerPage;
    return visibleRows.slice(start, start + rowsPerPage);
  }, [visibleRows, pageSize, currentPage, rowsPerPage]);

  // ── Export ──────────────────────────────────────────────────────────────────
  const exportExcel = () => {
    // Export all columns, including hidden ones (visible === false)
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
    // Export all columns, including hidden ones (visible === false)
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
  const renderGrid = () => {
    const hasGroupableCols = visibleColumns.some((c) => c.group === true);
    const showGroupRow     = allColumnGroups.length > 0 || hasGroupableCols;
    const GROUP_ROW_H      = 32;
    const colHeaderTop     = showGroupRow ? GROUP_ROW_H : 0;

    return (
    <Box sx={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
      <Box sx={{ minWidth: totalWidth + (selectable ? checkboxColWidth : 0) + (rowContextMenu ? actionsColWidth : 0) }}>

        {/* Group header / drop-zone row */}
        {showGroupRow && (
          <Box sx={{
            display: "flex", bgcolor: resolvedHeaderBgColor,
            position: "sticky", top: 0, zIndex: 2,
            borderBottom: `2px solid ${groupBorderColor}`,
            minHeight: GROUP_ROW_H,
          }}>
            {expandable && <Box sx={{ width: 36, flexShrink: 0 }} />}
            {selectable && <Box sx={{ width: checkboxColWidth, flexShrink: 0 }} />}
            {(() => {
              const rendered: React.ReactNode[] = [];
              const seen = new Set<string>();
              for (const col of visibleColumns) {
                const grp = groupByField[col.field];
                if (grp && !seen.has(grp.id)) {
                  seen.add(grp.id);
                  const grpCols  = visibleColumns.filter((c) => groupByField[c.field]?.id === grp.id);
                  const collapsed = collapsedGroups.has(grp.id);
                  const grpWidth = collapsed
                    ? (grpCols[0]?.width ?? 120)
                    : grpCols.reduce((a, c) => a + (c.width ?? 120), 0);
                  const isDropTarget = dragField !== null && dragOverField !== null &&
                    grpCols.some((c) => c.field === dragOverField);
                  rendered.push(
                    <Box
                      key={grp.id}
                      onDragOver={(e) => {
                        if (dragField && !isInStaticGroup(dragField)) {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          setDragOverField(grpCols[0]?.field ?? null);
                        }
                      }}
                      onDragLeave={handleColDragLeave}
                      onDrop={(e) => handleColDrop(e as React.DragEvent<HTMLDivElement>, grpCols[0]?.field ?? "")}
                      onClick={() => (grp.collapsible !== false ? toggleGroupCollapse(grp.id) : undefined)}
                      sx={{
                        width: grpWidth, flexShrink: 0,
                        px: "6px",
                        borderRight: `1px solid ${groupBorderColor}`,
                        bgcolor: isDropTarget ? "rgba(33,150,243,0.18)" : (grp.headerBgColor ?? resolvedHeaderBgColor),
                        color: grp.headerTextColor ?? resolvedHeaderTextColor,
                        textAlign: "center",
                        fontSize: "0.75rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5,
                        cursor: grp.collapsible !== false ? "pointer" : "default",
                        userSelect: "none",
                        outline: isDropTarget ? "2px dashed #2196f3" : "none",
                        outlineOffset: "-2px",
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
                      {dynamicGroups.some((g) => g.id === grp.id) && (
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); removeDynamicGroup(grp.id); }}
                          sx={{ p: "1px", color: "inherit", ml: 0.25, opacity: 0.7, "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.2)" } }}
                        >
                          <CloseIcon sx={{ fontSize: "0.75rem" }} />
                        </IconButton>
                      )}
                    </Box>,
                  );
                } else if (!grp) {
                  const isThisDragField    = dragField === col.field;
                  const isThisDropTarget   = dragField !== null && dragOverField === col.field && !isThisDragField;
                  const isDraggableCol     = col.group === true;
                  rendered.push(
                    <Box
                      key={col.field}
                      onDragOver={(e) => isDraggableCol && handleColDragOver(e as React.DragEvent<HTMLDivElement>, col.field)}
                      onDragLeave={handleColDragLeave}
                      onDrop={(e) => isDraggableCol && handleColDrop(e as React.DragEvent<HTMLDivElement>, col.field)}
                      sx={{
                        width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                        borderRight: `1px solid ${headerBorderColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        ...(dragField !== null && isDraggableCol ? {
                          border: isThisDropTarget
                            ? "2px dashed #2196f3"
                            : isThisDragField
                            ? "2px dashed rgba(33,150,243,0.4)"
                            : "1px dashed rgba(33,150,243,0.3)",
                          bgcolor: isThisDropTarget
                            ? "rgba(33,150,243,0.14)"
                            : isThisDragField
                            ? "rgba(33,150,243,0.06)"
                            : "rgba(33,150,243,0.03)",
                          cursor: "copy",
                        } : {}),
                      }}
                    >
                      {dragField !== null && isDraggableCol && (
                        <Typography variant="caption" sx={{
                          fontSize: "0.6rem", fontWeight: 700, userSelect: "none",
                          color: isThisDropTarget ? "#2196f3" : isThisDragField ? "rgba(33,150,243,0.6)" : "rgba(33,150,243,0.35)",
                        }}>
                          {isThisDragField ? "dragging…" : isThisDropTarget ? "Drop to group" : "⊕"}
                        </Typography>
                      )}
                      {dragField === null && isDraggableCol && (
                        <Typography variant="caption" sx={{ fontSize: "0.58rem", color: "text.disabled", userSelect: "none" }}>
                          ⊕ group
                        </Typography>
                      )}
                    </Box>,
                  );
                }
              }
              if (rowContextMenu) rendered.push(<Box key="__actions__" sx={{ width: actionsColWidth, flexShrink: 0 }} />);
              if (onRowSave) rendered.push(<Box key="__edit__" sx={{ width: editColWidth, flexShrink: 0 }} />);
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
            top: colHeaderTop,
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
            const isSortable = col.sort ?? col.sortable ?? false;
            const hasMenu = col.menu === true;
            const isDraggable = col.group === true && !isInStaticGroup(col.field);
            const isFilterable = col.filter === true;
            const activeCount = activeFilterCount(col.field);
            const isDragTarget = dragOverField === col.field;
            const headerContent = headerRowTemplate
              ? headerRowTemplate(col, groupByField[col.field])
              : col.renderHeader
              ? col.renderHeader(col)
              : col.headerName ?? col.field;

            return (
              <Box
                key={col.field}
                draggable={isDraggable}
                onDragStart={(e) => isDraggable && handleColDragStart(e as React.DragEvent<HTMLDivElement>, col.field)}
                onDragOver={(e) => handleColDragOver(e as React.DragEvent<HTMLDivElement>, col.field)}
                onDragLeave={handleColDragLeave}
                onDrop={(e) => handleColDrop(e as React.DragEvent<HTMLDivElement>, col.field)}
                onDragEnd={handleColDragEnd}
                onClick={() => isSortable && handleSort(col.field)}
                sx={{
                  width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                  px: "8px", py: "6px",
                  borderRight: `1px solid ${midBorderColor}`,
                  borderBottom: `2px solid ${isDragTarget ? "#2196f3" : groupBorderColor}`,
                  borderTop: isDragTarget ? "2px solid #2196f3" : undefined,
                  display: "flex", alignItems: "center",
                  justifyContent: (() => { const a = col.headerAlign ?? col.textAlign ?? "left"; return a === "center" ? "center" : a === "right" ? "flex-end" : "space-between"; })(),
                  cursor: isSortable ? "pointer" : (isDraggable ? "grab" : "default"),
                  userSelect: "none",
                  "&:hover": isSortable ? { bgcolor: rowBorderColor } : {},
                  overflow: "hidden", gap: 0.5,
                  ...(isDragTarget ? { bgcolor: "rgba(33,150,243,0.08)" } : {}),
                }}
              >
                {isDraggable && (
                  <DragIndicatorIcon sx={{ fontSize: "0.8rem", color: resolvedHeaderTextColor, opacity: 0.35, flexShrink: 0, cursor: "grab" }} />
                )}
                <Typography variant="caption" fontWeight={700} noWrap sx={{ color: resolvedHeaderTextColor, lineHeight: 1.4, flex: 1 }}>
                  {headerContent}
                </Typography>
                {isSortable && (
                  <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: resolvedHeaderTextColor }}>
                    {isSorted ? (
                      sortDir === "asc" ? <ArrowUpwardIcon sx={{ fontSize: "0.85rem" }} /> : <ArrowDownwardIcon sx={{ fontSize: "0.85rem" }} />
                    ) : (
                      <ArrowUpwardIcon sx={{ fontSize: "0.85rem", opacity: 0.3 }} />
                    )}
                  </Box>
                )}
                {isFilterable && (
                  <Tooltip title={activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} active` : "Filter column"}>
                    <Box sx={{ position: "relative", flexShrink: 0 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => openFilterPanel(e, col.field)}
                        sx={{ p: "2px", color: activeCount > 0 ? "#2196f3" : resolvedHeaderTextColor, flexShrink: 0 }}
                      >
                        <FilterListIcon sx={{ fontSize: "0.9rem" }} />
                      </IconButton>
                      {activeCount > 0 && (
                        <Box sx={{
                          position: "absolute", top: -1, right: -1,
                          width: 12, height: 12,
                          bgcolor: "#2196f3", color: "#fff",
                          borderRadius: "50%",
                          fontSize: "0.5rem", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          pointerEvents: "none",
                        }}>
                          {activeCount}
                        </Box>
                      )}
                    </Box>
                  </Tooltip>
                )}
                {hasMenu && (
                  <IconButton
                    size="small"
                    onClick={(e) => openColMenu(e, col)}
                    sx={{ p: "2px", color: resolvedHeaderTextColor, flexShrink: 0, ml: 0.25 }}
                  >
                    <MoreVertIcon sx={{ fontSize: "0.9rem" }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
          {rowContextMenu && <Box sx={{ width: actionsColWidth, flexShrink: 0 }} />}
          {onRowSave && <Box sx={{ width: editColWidth, flexShrink: 0 }} />}
        </Box>

        {/* Per-column filter row */}
        {showColumnFilters && (
          <Box
            sx={{
              display: "flex",
              bgcolor: "background.paper",
              borderBottom: `1px solid ${midBorderColor}`,
              position: "sticky",
              top: (allColumnGroups.length > 0 ? 30 : 0) + 44,
              zIndex: 1,
            }}
          >
            {expandable && <Box sx={{ width: 36, flexShrink: 0 }} />}
            {selectable && <Box sx={{ width: checkboxColWidth, flexShrink: 0 }} />}
            {visibleColumns.map((col) => {
              const isFilterable = col.filter === true;
              return (
                <Box
                  key={col.field}
                  sx={{
                    width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                    px: "4px", py: "3px",
                    borderRight: `1px solid ${rowBorderColor}`,
                  }}
                >
                  {isFilterable ? (
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
                  ) : null}
                </Box>
              );
            })}
            {rowContextMenu && <Box sx={{ width: actionsColWidth, flexShrink: 0 }} />}
            {onRowSave && <Box sx={{ width: editColWidth, flexShrink: 0 }} />}
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
                  const isEditing = editingRowId === row.id;

                  return (
                    <Box
                      key={col.field}
                      sx={{
                        width: col.width ?? 120, flex: col.flex ?? "none", flexShrink: 0,
                        px: "8px", py: "4px",
                        borderRight: `1px solid ${rowBorderColor}`,
                        display: "flex", alignItems: "center",
                        justifyContent: (() => { const a = col.align ?? col.textAlign ?? "left"; return a === "center" ? "center" : a === "right" ? "flex-end" : "flex-start"; })(),
                        overflow: "hidden",
                        pl: col === visibleColumns[0] ? `${8 + indent}px` : "8px",
                        ...(col.colColor ? { backgroundColor: col.colColor } : {}),
                      }}
                    >
                      {isEditing && col.editable ? (
                        <TextField
                          size="small"
                          value={String(editDraft[col.field] ?? "")}
                          onChange={(e) => {
                            setEditDraft((prev) => ({ ...prev, [col.field]: e.target.value }));
                            if (editErrors.has(col.field)) setEditErrors((prev) => { const n = new Map(prev); n.delete(col.field); return n; });
                          }}
                          variant="standard"
                          error={editErrors.has(col.field)}
                          helperText={editErrors.get(col.field)}
                          autoFocus={col === visibleColumns.find((c) => c.editable)}
                          sx={{ width: "100%", "& .MuiInputBase-input": { fontSize: "0.85rem", py: "2px" } }}
                        />
                      ) : col.renderCell ? (
                        (cell ?? "—")
                      ) : (
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
                {onRowSave && (
                  <Box sx={{ width: editColWidth, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.25 }}>
                    {editingRowId === row.id ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton size="small" color="primary" onClick={commitEdit}>
                            <CheckIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton size="small" onClick={cancelEdit}>
                            <CloseIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Edit row">
                        <IconButton size="small" onClick={() => startEdit(row)} disabled={editingRowId !== null && editingRowId !== row.id}>
                          <EditIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
  };

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

      {/* Multi-filter panel */}
      {(() => {
        const fpCol = filterPanelField ? columns.find((c) => c.field === filterPanelField) : undefined;
        if (!fpCol || !filterPanelAnchor) return null;
        const fpField = filterPanelField!;
        return (
          <FilterPanel
            col={fpCol}
            colType={detectColType(fpCol, rows)}
            anchorEl={filterPanelAnchor}
            filterState={multiFilters[fpField] ?? { logic: "AND", conditions: [] }}
            onFilterChange={(s) => setColMultiFilter(fpField, s)}
            onClose={closeFilterPanel}
          />
        );
      })()}

      {/* Column header menu */}
      <Menu
        anchorEl={colMenuState?.anchor ?? null}
        open={Boolean(colMenuState)}
        onClose={closeColMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {colMenuState && (() => {
          const menuField = colMenuState.col.field;
          return (
            <>
              <MenuItem dense onClick={() => { handleSort(menuField); setSortDir("asc"); closeColMenu(); }}>
                <ListItemIcon sx={{ minWidth: 28 }}><ArrowUpwardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Sort A → Z</ListItemText>
              </MenuItem>
              <MenuItem dense onClick={() => { handleSort(menuField); setSortDir("desc"); closeColMenu(); }}>
                <ListItemIcon sx={{ minWidth: 28 }}><ArrowDownwardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Sort Z → A</ListItemText>
              </MenuItem>
              {visibleColumns.length > 1 && (
                <MenuItem dense divider onClick={() => { setHiddenColFields((p) => new Set([...p, menuField])); closeColMenu(); }}>
                  <ListItemIcon sx={{ minWidth: 28 }}><CloseIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Hide column</ListItemText>
                </MenuItem>
              )}
            </>
          );
        })()}
      </Menu>

      {/* Context menu */}
      {rowContextMenu && (
        <Menu
          anchorEl={ctxAnchor}
          open={Boolean(ctxAnchor)}
          onClose={closeContextMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {ctxRow && rowContextMenu && (() => {
            const row = ctxRow;
            return rowContextMenu(row).map((item, i) => (
              <MenuItem
                key={i}
                divider={item.divider}
                onClick={() => { item.onClick(row); closeContextMenu(); }}
                dense
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                )}
                <ListItemText primaryTypographyProps={{ fontSize: "0.85rem" }}>
                  {item.label}
                </ListItemText>
              </MenuItem>
            ));
          })()}
        </Menu>
      )}
    </Box>
  );
};

export default VrmaAdvancedDataGrid;
