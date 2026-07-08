import React from "react";
import {
  Box,
  Collapse,
  Typography,
  IconButton,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export interface TreeNode {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactElement;
  /** Override expand/collapse icon for branch nodes */
  expandIcon?: React.ReactElement;
  collapseIcon?: React.ReactElement;
  disabled?: boolean;
  children?: TreeNode[];
  /** Extra content rendered on the right */
  endAdornment?: React.ReactNode;
}

export interface VrmaTreeViewProps {
  nodes: TreeNode[];
  /** Controlled expanded keys */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (keys: string[]) => void;
  /** Controlled selected key(s) */
  selected?: string | string[];
  defaultSelected?: string | string[];
  onSelectedChange?: (keys: string | string[]) => void;
  /** Allow multiple selection */
  multiSelect?: boolean;
  dense?: boolean;
  /** Indent per level in px */
  indent?: number;
  /** Show default folder/file icons when node has no icon */
  defaultIcons?: boolean;
  /** Show connecting lines */
  showLines?: boolean;
  sx?: SxProps<Theme>;
}

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  indent: number;
  dense: boolean;
  defaultIcons: boolean;
  showLines: boolean;
  expandedKeys: Set<string>;
  selectedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
  onToggleSelect: (key: string) => void;
}

function TreeNodeItem({
  node,
  depth,
  indent,
  dense,
  defaultIcons,
  showLines,
  expandedKeys,
  selectedKeys,
  onToggleExpand,
  onToggleSelect,
}: TreeNodeProps) {
  const hasBranch = node.children && node.children.length > 0;
  const isExpanded = expandedKeys.has(node.key);
  const isSelected = selectedKeys.has(node.key);

  const expandIcon = hasBranch
    ? (isExpanded
      ? (node.collapseIcon ?? <ExpandMoreIcon sx={{ fontSize: 18 }} />)
      : (node.expandIcon ?? <ChevronRightIcon sx={{ fontSize: 18 }} />))
    : null;

  let resolvedIcon = node.icon;
  if (!resolvedIcon && defaultIcons) {
    if (hasBranch) {
      resolvedIcon = isExpanded
        ? <FolderOpenIcon sx={{ fontSize: 18, color: "warning.main" }} />
        : <FolderIcon sx={{ fontSize: 18, color: "warning.main" }} />;
    } else {
      resolvedIcon = <InsertDriveFileIcon sx={{ fontSize: 18, color: "text.disabled" }} />;
    }
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          pl: `${depth * indent + (hasBranch ? 0 : 24)}px`,
          pr: 1,
          py: dense ? 0.25 : 0.5,
          cursor: node.disabled ? "not-allowed" : "pointer",
          opacity: node.disabled ? 0.5 : 1,
          borderRadius: 1,
          bgcolor: isSelected ? "primary.main" : "transparent",
          color: isSelected ? "primary.contrastText" : "text.primary",
          "&:hover": node.disabled ? {} : {
            bgcolor: isSelected ? "primary.dark" : "action.hover",
          },
          transition: "background-color 0.15s",
          ...(showLines && depth > 0 && {
            "&::before": {
              content: '""',
              position: "absolute",
              left: `${(depth - 1) * indent + 10}px`,
              top: "50%",
              width: `${indent - 10}px`,
              height: "1px",
              bgcolor: "divider",
            },
          }),
        }}
        onClick={() => {
          if (node.disabled) return;
          if (hasBranch) onToggleExpand(node.key);
          onToggleSelect(node.key);
        }}
      >
        {/* expand toggle */}
        {hasBranch && (
          <IconButton
            size="small"
            disableRipple
            sx={{ p: 0, mr: 0.25, color: isSelected ? "inherit" : "action.active" }}
            onClick={(e) => {
              e.stopPropagation();
              if (!node.disabled) onToggleExpand(node.key);
            }}
          >
            {expandIcon}
          </IconButton>
        )}

        {resolvedIcon && (
          <Box sx={{ display: "flex", mr: 0.75, color: isSelected ? "inherit" : "action.active" }}>
            {resolvedIcon}
          </Box>
        )}

        <Typography
          variant={dense ? "body2" : "body1"}
          noWrap
          sx={{ flex: 1, userSelect: "none" }}
        >
          {node.label}
        </Typography>

        {node.endAdornment && (
          <Box sx={{ ml: 1, flexShrink: 0, color: isSelected ? "inherit" : "action.active" }}>
            {node.endAdornment}
          </Box>
        )}
      </Box>

      {hasBranch && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.key}
              node={child}
              depth={depth + 1}
              indent={indent}
              dense={dense}
              defaultIcons={defaultIcons}
              showLines={showLines}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onToggleExpand={onToggleExpand}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </Collapse>
      )}
    </>
  );
}

const VrmaTreeView: React.FC<VrmaTreeViewProps> = ({
  nodes,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  multiSelect = false,
  dense = false,
  indent = 20,
  defaultIcons = true,
  showLines = false,
  sx,
}) => {
  const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(
    new Set(defaultExpanded)
  );
  const isExpandedControlled = expandedProp !== undefined;
  const expandedKeys = isExpandedControlled
    ? new Set(expandedProp)
    : internalExpanded;

  const normalizeSelected = (v: string | string[] | undefined): Set<string> => {
    if (!v) return new Set();
    return new Set(Array.isArray(v) ? v : [v]);
  };
  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(
    normalizeSelected(defaultSelected)
  );
  const isSelectedControlled = selectedProp !== undefined;
  const selectedKeys = isSelectedControlled
    ? normalizeSelected(selectedProp)
    : internalSelected;

  function handleToggleExpand(key: string) {
    const next = new Set(expandedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    if (!isExpandedControlled) setInternalExpanded(next);
    onExpandedChange?.([...next]);
  }

  function handleToggleSelect(key: string) {
    let next: Set<string>;
    if (multiSelect) {
      next = new Set(selectedKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
    } else {
      next = selectedKeys.has(key) ? new Set() : new Set([key]);
    }
    if (!isSelectedControlled) setInternalSelected(next);
    const arr = [...next];
    onSelectedChange?.(multiSelect ? arr : (arr[0] ?? ""));
  }

  return (
    <Box sx={{ ...(sx as object) }}>
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.key}
          node={node}
          depth={0}
          indent={indent}
          dense={dense}
          defaultIcons={defaultIcons}
          showLines={showLines}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onToggleExpand={handleToggleExpand}
          onToggleSelect={handleToggleSelect}
        />
      ))}
    </Box>
  );
};

export default VrmaTreeView;
