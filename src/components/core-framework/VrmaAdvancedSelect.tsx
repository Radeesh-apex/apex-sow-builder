import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import VrmaToolTip from "./VrmaToolTip";

export interface VrmaAdvancedOption<T extends string | number> {
  label: string;
  value: T;
  icon?: React.ReactNode;
  text?: React.ReactNode;
  [key: string]: unknown;
}

type SingleProps<T extends string | number> = {
  multiple?: false;
  value: T | null;
  onChange: (value: T | null) => void;
};

type MultiProps<T extends string | number> = {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
};

interface LazyLoadConfig {
  pageSize?: number;
  loadOnScroll?: boolean;
  loadMoreThreshold?: number;
  onError?: (error: Error) => void;
}

type Props<T extends string | number> = {
  label?: string;
  options?: VrmaAdvancedOption<T>[];
  onLoadMore?: (skip: number, limit: number) => Promise<VrmaAdvancedOption<T>[]>;
  isLoading?: boolean;
  hasMore?: boolean;
  renderOption?: (option: VrmaAdvancedOption<T>) => React.ReactNode;
  renderValue?: (
    value: VrmaAdvancedOption<T> | VrmaAdvancedOption<T>[] | null,
    getTagProps?: (opts: { index: number }) => Record<string, unknown>,
  ) => React.ReactNode;
  size?: "small" | "medium";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  color?: "primary" | "secondary";
  labelSize?: "small" | "medium" | "large" | number;
  width?: number | string;
  lazyLoadConfig?: LazyLoadConfig;
  filterSelectedOptions?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  /** "helperText" shows error below the field (default); "tooltip" shows it in a red tooltip */
  errorVariant?: "helperText" | "tooltip";
  /** Tooltip placement when errorVariant="tooltip" (default: "right") */
  tooltipPlacement?: "left" | "right" | "top" | "bottom";
  /** Message shown in the dropdown while options are loading (default: "Loading items...") */
  loadingText?: string;
} & (SingleProps<T> | MultiProps<T>);

const VrmaAdvancedSelect = React.forwardRef(
  <T extends string | number>(
    {
      label,
      value,
      options: initialOptions = [],
      onChange,
      multiple = false,
      renderOption,
      renderValue,
      size = "medium",
      variant = "outlined",
      disabled = false,
      fullWidth = true,
      color = "primary",
      labelSize = "medium",
      width = "100%",
      onLoadMore,
      isLoading: externalIsLoading = false,
      hasMore = true,
      lazyLoadConfig = {},
      filterSelectedOptions,
      required = false,
      error = false,
      helperText,
      errorVariant = "helperText",
      tooltipPlacement = "right",
      loadingText = "Loading items...",
    }: Props<T>,
    ref: React.Ref<unknown>,
  ) => {
    const resolvedHelperText =
      helperText ??
      (error && required && label
        ? `The ${label.trim().charAt(0).toUpperCase() + label.trim().slice(1)} field is required`
        : "");

    const [options, setOptions] = useState<VrmaAdvancedOption<T>[]>(initialOptions);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(hasMore);
    const [isOpen, setIsOpen] = useState(false);
    const skipRef = useRef(0);
    const pageSize = lazyLoadConfig.pageSize ?? 10;
    const loadMoreThreshold = lazyLoadConfig.loadMoreThreshold ?? 0.8;

    const lazyLoadConfigRef = useRef(lazyLoadConfig);
    lazyLoadConfigRef.current = lazyLoadConfig;

    // Cache selected options so they survive lazy-load option list resets
    const selectedOptionsCache = useRef<Map<T, VrmaAdvancedOption<T>>>(new Map());

    useEffect(() => {
      if (!onLoadMore) {
        setOptions(initialOptions);
      }
    }, [initialOptions, onLoadMore]);

    useEffect(() => {
      setHasMoreItems(hasMore);
    }, [hasMore]);

    const effectiveFilterSelected = filterSelectedOptions ?? multiple;

    const selectedValue = multiple
      ? (value as T[])
          .map((v) => options.find((o) => o.value === v) ?? selectedOptionsCache.current.get(v))
          .filter((o): o is VrmaAdvancedOption<T> => !!o)
      : options.find((opt) => opt.value === value) ??
        (value !== null ? selectedOptionsCache.current.get(value as T) ?? null : null);

    const labelSizeMap: Record<"small" | "medium" | "large", string> = {
      small: "0.75rem",
      medium: "0.875rem",
      large: "1rem",
    };
    const resolvedLabelSize =
      typeof labelSize === "number" ? `${labelSize}px` : labelSizeMap[labelSize];

    const handleLoadMore = useCallback(async () => {
      if (!onLoadMore || isLoading || externalIsLoading || !hasMoreItems) return;

      setIsLoading(true);
      try {
        const newOptions = await onLoadMore(skipRef.current, pageSize);
        if (newOptions.length < pageSize) {
          setHasMoreItems(false);
        } else {
          skipRef.current += pageSize;
        }
        setOptions((prev) => [...prev, ...newOptions]);
      } catch (error) {
        lazyLoadConfigRef.current.onError?.(
          error instanceof Error ? error : new Error(String(error)),
        );
      } finally {
        setIsLoading(false);
      }
    }, [onLoadMore, isLoading, externalIsLoading, hasMoreItems, pageSize]);

    const handleListboxScroll = useCallback(
      (event: React.SyntheticEvent) => {
        if (!lazyLoadConfigRef.current.loadOnScroll) return;
        const listboxNode = event.currentTarget as HTMLElement;
        if (!listboxNode) return;
        const scrollPercentage =
          (listboxNode.scrollTop + listboxNode.clientHeight) / listboxNode.scrollHeight;
        if (scrollPercentage > loadMoreThreshold && hasMoreItems && !isLoading) {
          handleLoadMore();
        }
      },
      [loadMoreThreshold, hasMoreItems, isLoading, handleLoadMore],
    );

    // For single select with custom renderOption, show selected value in same format
    const singleSelected = !multiple ? (selectedValue as VrmaAdvancedOption<T> | null) : null;
    const hasCustomSingleRender = !multiple && !!renderOption && !!singleSelected && !isOpen;

    const autocomplete = (
      <Autocomplete
        ref={ref}
        multiple={multiple}
        options={options}
        value={selectedValue as never}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        loading={isLoading || externalIsLoading}
        filterSelectedOptions={effectiveFilterSelected}
        open={isOpen}
        onOpen={() => {
          setIsOpen(true);
          if (options.length === 0 && onLoadMore && !externalIsLoading) {
            handleLoadMore();
          }
        }}
        onClose={() => setIsOpen(false)}
        sx={{ width, fontSize: resolvedLabelSize }}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        onChange={(_, newValue) => {
          if (multiple) {
            const selected = newValue as VrmaAdvancedOption<T>[];
            // Sync cache: add selected, remove deselected
            selected.forEach((opt) => selectedOptionsCache.current.set(opt.value as T, opt));
            const selectedKeys = new Set(selected.map((o) => o.value as T));
            for (const k of selectedOptionsCache.current.keys()) {
              if (!selectedKeys.has(k)) selectedOptionsCache.current.delete(k);
            }
            (onChange as (value: T[]) => void)(selected.map((v) => v.value));
          } else {
            const opt = newValue as VrmaAdvancedOption<T> | null;
            if (opt) selectedOptionsCache.current.set(opt.value as T, opt);
            else selectedOptionsCache.current.clear();
            (onChange as (value: T | null) => void)(opt?.value ?? null);
          }
        }}
        renderOption={(props, option) => {
          const { key, ...rest } = props as { key?: React.Key } & Record<string, unknown>;
          return (
            <li key={key} {...rest}>
              {renderOption ? renderOption(option) : option.label}
            </li>
          );
        }}
        renderTags={(selected, getTagProps) =>
          renderValue
            ? (renderValue(selected, getTagProps) as React.ReactNode)
            : selected.map((option, index) => {
                const { key, ...restTagProps } = getTagProps({ index }) as {
                  key?: React.Key;
                  onDelete?: React.EventHandler<React.SyntheticEvent>;
                } & Record<string, unknown>;
                return (
                  <Chip
                    key={option.value}
                    label={
                      renderOption ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {renderOption(option)}
                        </Box>
                      ) : (
                        option.label
                      )
                    }
                    {...restTagProps}
                    sx={{ maxWidth: 240, height: "auto", "& .MuiChip-label": { py: 0.5 } }}
                  />
                );
              })
        }
        ListboxProps={{
          onScroll: handleListboxScroll,
          sx: { maxHeight: 300 },
        }}
        noOptionsText={
          isLoading || externalIsLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">{loadingText}</Typography>
            </Box>
          ) : (
            "No options"
          )
        }
        renderInput={(params) => {
          const inputProps: typeof params.InputProps = {
            ...params.InputProps,
            // When a single option is selected and dropdown is closed, show the
            // same custom renderer that the dropdown list uses
            startAdornment: hasCustomSingleRender
              ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    pl: 0.5,
                    maxWidth: "calc(100% - 48px)",
                    overflow: "hidden",
                  }}
                >
                  {renderOption!(singleSelected!)}
                </Box>
              )
              : !multiple && renderValue
              ? renderValue(singleSelected) as React.ReactNode
              : params.InputProps.startAdornment,
          };

          return (
            <TextField
              {...params}
              label={label}
              variant={variant}
              color={color}
              required={required}
              error={error}
              helperText={errorVariant === "helperText" ? resolvedHelperText : undefined}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink: hasCustomSingleRender ? true : undefined,
                sx: { fontSize: resolvedLabelSize },
              }}
              InputProps={inputProps}
              inputProps={{
                ...params.inputProps,
                // Hide native text input when showing custom rendered selected value
                style: {
                  ...params.inputProps?.style,
                  textAlign: "left",
                  ...(hasCustomSingleRender
                    ? { width: 0, opacity: 0, padding: 0 }
                    : {}),
                },
              }}
              sx={{
                "& .MuiFormLabel-asterisk": { color: "error.main" },
                "& .MuiFormHelperText-root": { textAlign: "left" },
                "& .MuiInputBase-input": { textAlign: "left" },
                "& .MuiAutocomplete-input": { textAlign: "left" },
              }}
            />
          );
        }}
      />
    );

    if (errorVariant === "tooltip") {
      return (
        <Box sx={{ position: "relative", width, "& .MuiFormControl-root": { width: "100%" } }}>
          {autocomplete}
          <VrmaToolTip
            title={resolvedHelperText}
            severity="error"
            open={error && Boolean(resolvedHelperText)}
            placement={tooltipPlacement}
            arrow
          >
            <Box
              component="span"
              sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, pointerEvents: "none" }}
            />
          </VrmaToolTip>
        </Box>
      );
    }

    return autocomplete;
  },
);

VrmaAdvancedSelect.displayName = "VrmaAdvancedSelect";

export default VrmaAdvancedSelect;
