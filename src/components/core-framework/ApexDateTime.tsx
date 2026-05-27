import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) { return String(n).padStart(2, "0"); }

export function formatDate(date: Date, fmt: string): string {
  const y = date.getFullYear();
  const M = date.getMonth() + 1;
  const d = date.getDate();
  const H = date.getHours();
  const h = H % 12 || 12;
  const m = date.getMinutes();
  const s = date.getSeconds();
  const ampm = H < 12 ? "AM" : "PM";
  const tokens: Record<string, string> = {
    yyyy: String(y).padStart(4, "0"), yy: String(y).slice(-2),
    MM: pad(M), dd: pad(d), HH: pad(H), hh: pad(h),
    mm: pad(m), ss: pad(s), tt: ampm,
  };
  return fmt.replace(/yyyy|yy|MM|dd|HH|hh|mm|ss|tt/g, (t) => tokens[t] ?? t);
}

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getDefaultFormat(mode: string, use12Hour: boolean, showSeconds: boolean): string {
  const timeFmt = use12Hour
    ? (showSeconds ? "hh:mm:ss tt" : "hh:mm tt")
    : (showSeconds ? "HH:mm:ss" : "HH:mm");
  if (mode === "date") return "dd/MM/yyyy";
  if (mode === "time") return timeFmt;
  return `dd/MM/yyyy ${timeFmt}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApexDateTimeProps {
  mode?: "date" | "time" | "datetime";
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  format?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  use12Hour?: boolean;
  showSeconds?: boolean;
  clearable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// ── TimeSpinner ───────────────────────────────────────────────────────────────

function TimeSpinner({ value, label, onUp, onDown }: { value: number; label: string; onUp: () => void; onDown: () => void }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 }}>
      <IconButton size="small" onClick={onUp} sx={{ p: 0.5 }}>
        <KeyboardArrowUpIcon fontSize="small" />
      </IconButton>
      <Box sx={{ textAlign: "center", lineHeight: 1 }}>
        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>{pad(value)}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.62rem" }}>{label}</Typography>
      </Box>
      <IconButton size="small" onClick={onDown} sx={{ p: 0.5 }}>
        <KeyboardArrowDownIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ── ApexDateTime ──────────────────────────────────────────────────────────────

const ApexDateTime: React.FC<ApexDateTimeProps> = ({
  mode = "datetime",
  value = null,
  onChange,
  format,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  size = "medium",
  fullWidth = true,
  use12Hour = false,
  showSeconds = false,
  clearable = true,
  minDate,
  maxDate,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"date" | "time">("date");
  const [calView, setCalView] = useState<"days" | "months" | "years">("days");
  const [temp, setTemp] = useState<Date>(() => value ?? new Date());
  const [displayMonth, setDisplayMonth] = useState(() => {
    const d = value ?? new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [yearStart, setYearStart] = useState(() => {
    const y = (value ?? new Date()).getFullYear();
    return y - 5;
  });

  const fmt = format ?? getDefaultFormat(mode, use12Hour, showSeconds);
  const displayValue = value ? formatDate(value, fmt) : "";

  // ── Range helpers ────────────────────────────────────────────────────────────
  const minDay = minDate ? startOfDay(minDate) : null;
  const maxDay = maxDate ? startOfDay(maxDate) : null;

  const isDayDisabled = (day: Date) => {
    const d = startOfDay(day);
    if (minDay && d < minDay) return true;
    if (maxDay && d > maxDay) return true;
    return false;
  };

  const isMonthDisabled = (year: number, month: number) => {
    if (minDay && startOfDay(new Date(year, month + 1, 0)) < minDay) return true;
    if (maxDay && startOfDay(new Date(year, month, 1)) > maxDay) return true;
    return false;
  };

  const isYearDisabled = (year: number) => {
    if (minDay && new Date(year, 11, 31) < minDay) return true;
    if (maxDay && new Date(year, 0, 1) > maxDay) return true;
    return false;
  };

  // Disable prev arrow in days view if entire prev month is before minDate
  const prevDisabled = calView === "days" && !!minDay &&
    startOfDay(new Date(displayMonth.year, displayMonth.month, 0)) < minDay;

  // Disable next arrow in days view if entire next month is after maxDate
  const nextDisabled = calView === "days" && !!maxDay &&
    startOfDay(new Date(displayMonth.year, displayMonth.month + 1, 1)) > maxDay;

  // ── Open / close ────────────────────────────────────────────────────────────
  const handleOpen = () => {
    if (disabled) return;
    let d = value ? new Date(value.getTime()) : new Date();
    if (minDay && startOfDay(d) < minDay) d = new Date(minDate!.getTime());
    if (maxDay && startOfDay(d) > maxDay) d = new Date(maxDate!.getTime());
    setTemp(d);
    setDisplayMonth({ year: d.getFullYear(), month: d.getMonth() });
    setYearStart(d.getFullYear() - 5);
    setCalView("days");
    setActiveTab("date");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOK = () => { onChange?.(new Date(temp.getTime())); setOpen(false); };

  const handleClear = (e?: React.MouseEvent) => { e?.stopPropagation(); onChange?.(null); };

  // ── Navigation ───────────────────────────────────────────────────────────────
  const prevNav = () => {
    if (calView === "years") { setYearStart((y) => y - 12); return; }
    if (calView === "months") { setDisplayMonth((p) => ({ ...p, year: p.year - 1 })); return; }
    setDisplayMonth((p) => {
      const d = new Date(p.year, p.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const nextNav = () => {
    if (calView === "years") { setYearStart((y) => y + 12); return; }
    if (calView === "months") { setDisplayMonth((p) => ({ ...p, year: p.year + 1 })); return; }
    setDisplayMonth((p) => {
      const d = new Date(p.year, p.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // ── Day / month / year selection ─────────────────────────────────────────────
  const handleDayClick = (day: Date) => {
    if (isDayDisabled(day)) return;
    const next = new Date(temp.getTime());
    next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    setTemp(next);
    if (mode === "date") { onChange?.(next); setOpen(false); }
    else setActiveTab("time");
  };

  const handleMonthSelect = (month: number) => {
    if (isMonthDisabled(displayMonth.year, month)) return;
    setDisplayMonth((p) => ({ ...p, month }));
    setCalView("days");
  };

  const handleYearSelect = (year: number) => {
    if (isYearDisabled(year)) return;
    setDisplayMonth((p) => ({ ...p, year }));
    setCalView("months");
  };

  // ── Time ─────────────────────────────────────────────────────────────────────
  const adjustTime = useCallback((field: "hour" | "minute" | "second" | "ampm", delta: number) => {
    setTemp((prev) => {
      const d = new Date(prev.getTime());
      if (field === "hour") {
        if (use12Hour) {
          const isAM = d.getHours() < 12;
          const h12 = d.getHours() % 12 || 12;
          let next = h12 + delta;
          if (next < 1) next = 12;
          if (next > 12) next = 1;
          d.setHours(isAM ? next % 12 : (next % 12) + 12);
        } else {
          d.setHours((d.getHours() + delta + 24) % 24);
        }
      } else if (field === "minute") {
        d.setMinutes((d.getMinutes() + delta + 60) % 60);
      } else if (field === "second") {
        d.setSeconds((d.getSeconds() + delta + 60) % 60);
      } else {
        const h = d.getHours();
        d.setHours(h < 12 ? h + 12 : h - 12);
      }
      return d;
    });
  }, [use12Hour]);

  const h24 = temp.getHours();
  const dispHour = use12Hour ? (h24 % 12 || 12) : h24;
  const isAM = h24 < 12;
  const today = new Date();
  const calDays = getCalendarDays(displayMonth.year, displayMonth.month);
  const popoverIcon = mode === "time"
    ? <AccessTimeIcon fontSize="small" />
    : <CalendarMonthIcon fontSize="small" />;
  const showCalendar = mode === "date" || (mode === "datetime" && activeTab === "date");
  const showTime = mode === "time" || (mode === "datetime" && activeTab === "time");

  // ── Calendar header (changes per calView) ────────────────────────────────────
  const renderHeader = () => {
    if (calView === "years") {
      return (
        <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1, textAlign: "center" }}>
          {yearStart} – {yearStart + 11}
        </Typography>
      );
    }
    if (calView === "months") {
      return (
        <Typography
          variant="subtitle2" fontWeight={700}
          onClick={() => { setYearStart(displayMonth.year - 5); setCalView("years"); }}
          sx={{ flex: 1, textAlign: "center", cursor: "pointer", "&:hover": { color: "primary.main" } }}
        >
          {displayMonth.year}
        </Typography>
      );
    }
    return (
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", gap: 0.5 }}>
        <Typography
          variant="subtitle2" fontWeight={700}
          onClick={() => setCalView("months")}
          sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
        >
          {MONTHS[displayMonth.month]}
        </Typography>
        <Typography
          variant="subtitle2" fontWeight={700}
          onClick={() => { setYearStart(displayMonth.year - 5); setCalView("years"); }}
          sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
        >
          {displayMonth.year}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Box ref={anchorRef} sx={{ display: "inline-flex", width: fullWidth ? "100%" : "auto" }}>
        <TextField
          label={label}
          value={displayValue}
          placeholder={placeholder ?? fmt.toLowerCase()}
          size={size}
          disabled={disabled}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {clearable && value && (
                    <IconButton size="small" onClick={handleClear} edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={handleOpen} disabled={disabled} edge="end">
                    {popoverIcon}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          onClick={handleOpen}
          sx={{ cursor: "pointer", "& input": { cursor: "pointer" } }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 6, overflow: "hidden", minWidth: 288 } }}
      >
        {/* Date/Time tab bar */}
        {mode === "datetime" && (
          <Box sx={{ display: "flex", borderBottom: "1px solid", borderColor: "divider" }}>
            {(["date", "time"] as const).map((tab) => (
              <Box
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  flex: 1, py: 1, textAlign: "center", cursor: "pointer",
                  fontSize: "0.75rem", fontWeight: activeTab === tab ? 700 : 400,
                  textTransform: "uppercase", letterSpacing: 0.5,
                  color: activeTab === tab ? "primary.main" : "text.secondary",
                  borderBottom: "2px solid",
                  borderColor: activeTab === tab ? "primary.main" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                {tab === "date" ? "📅 Date" : "🕐 Time"}
              </Box>
            ))}
          </Box>
        )}

        {/* Calendar */}
        {showCalendar && (
          <Box sx={{ p: 1.5, userSelect: "none" }}>
            {/* Navigation header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <IconButton size="small" onClick={prevNav} disabled={prevDisabled}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              {renderHeader()}
              <IconButton size="small" onClick={nextNav} disabled={nextDisabled}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Days view */}
            {calView === "days" && (
              <>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
                  {WEEKDAYS.map((wd) => (
                    <Typography key={wd} variant="caption" sx={{
                      textAlign: "center", fontWeight: 700,
                      color: "text.secondary", fontSize: "0.68rem",
                    }}>
                      {wd}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                  {calDays.map((day, idx) => {
                    if (!day) return <Box key={`e-${idx}`} sx={{ height: 32 }} />;
                    const isToday = isSameDay(day, today);
                    const isSel = isSameDay(day, temp);
                    const isOff = isDayDisabled(day);
                    return (
                      <Box
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        sx={{
                          height: 32, width: 32, borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          mx: "auto", fontSize: "0.8rem",
                          fontWeight: isSel || isToday ? 700 : 400,
                          bgcolor: isSel ? "primary.main" : "transparent",
                          color: isOff ? "text.disabled"
                            : isSel ? "primary.contrastText"
                            : isToday ? "primary.main" : "text.primary",
                          border: "1px solid",
                          borderColor: isToday && !isSel ? "primary.main" : "transparent",
                          cursor: isOff ? "default" : "pointer",
                          opacity: isOff ? 0.35 : 1,
                          transition: "background-color 0.12s",
                          "&:hover": isOff ? {} : { bgcolor: isSel ? "primary.dark" : "action.hover" },
                        }}
                      >
                        {day.getDate()}
                      </Box>
                    );
                  })}
                </Box>
              </>
            )}

            {/* Months view */}
            {calView === "months" && (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
                {MONTHS.map((m, i) => {
                  const isCur = i === displayMonth.month;
                  const isOff = isMonthDisabled(displayMonth.year, i);
                  return (
                    <Box
                      key={m}
                      onClick={() => handleMonthSelect(i)}
                      sx={{
                        py: 1, borderRadius: 1.5, textAlign: "center",
                        cursor: isOff ? "default" : "pointer",
                        bgcolor: isCur ? "primary.main" : "transparent",
                        color: isOff ? "text.disabled"
                          : isCur ? "primary.contrastText" : "text.primary",
                        fontSize: "0.8rem", fontWeight: isCur ? 700 : 400,
                        opacity: isOff ? 0.35 : 1,
                        "&:hover": isOff ? {} : { bgcolor: isCur ? "primary.dark" : "action.hover" },
                      }}
                    >
                      {m.slice(0, 3)}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Years view */}
            {calView === "years" && (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
                {Array.from({ length: 12 }, (_, i) => yearStart + i).map((y) => {
                  const isCur = y === displayMonth.year;
                  const isOff = isYearDisabled(y);
                  return (
                    <Box
                      key={y}
                      onClick={() => handleYearSelect(y)}
                      sx={{
                        py: 1, borderRadius: 1.5, textAlign: "center",
                        cursor: isOff ? "default" : "pointer",
                        bgcolor: isCur ? "primary.main" : "transparent",
                        color: isOff ? "text.disabled"
                          : isCur ? "primary.contrastText" : "text.primary",
                        fontSize: "0.82rem", fontWeight: isCur ? 700 : 400,
                        opacity: isOff ? 0.35 : 1,
                        "&:hover": isOff ? {} : { bgcolor: isCur ? "primary.dark" : "action.hover" },
                      }}
                    >
                      {y}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Time */}
        {showTime && (
          <Box sx={{ py: 2.5, px: 2, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
            <TimeSpinner value={dispHour} label={use12Hour ? "hour" : "24h"}
              onUp={() => adjustTime("hour", 1)} onDown={() => adjustTime("hour", -1)} />
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2, opacity: 0.6 }}>:</Typography>
            <TimeSpinner value={temp.getMinutes()} label="min"
              onUp={() => adjustTime("minute", 1)} onDown={() => adjustTime("minute", -1)} />
            {showSeconds && (
              <>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2, opacity: 0.6 }}>:</Typography>
                <TimeSpinner value={temp.getSeconds()} label="sec"
                  onUp={() => adjustTime("second", 1)} onDown={() => adjustTime("second", -1)} />
              </>
            )}
            {use12Hour && (
              <Box sx={{ ml: 1, display: "flex", flexDirection: "column", gap: 0.75, mb: 1.5 }}>
                {(["AM", "PM"] as const).map((period) => {
                  const active = period === "AM" ? isAM : !isAM;
                  return (
                    <Box key={period} onClick={() => !active && adjustTime("ampm", 1)} sx={{
                      px: 1.5, py: 0.5, borderRadius: 1.5, cursor: "pointer",
                      fontWeight: 700, fontSize: "0.72rem",
                      bgcolor: active ? "primary.main" : "action.hover",
                      color: active ? "primary.contrastText" : "text.secondary",
                      transition: "all 0.12s", "&:hover": { opacity: 0.85 },
                    }}>
                      {period}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          gap: 1, px: 1.5, pb: 1.5, pt: 0.5,
          borderTop: "1px solid", borderColor: "divider",
        }}>
          {clearable && value && (
            <Button size="small" color="inherit" onClick={handleClear} sx={{ mr: "auto", fontSize: "0.75rem" }}>
              Clear
            </Button>
          )}
          <Button size="small" onClick={handleClose}>Cancel</Button>
          {mode !== "date" && (
            <Button size="small" variant="contained" onClick={handleOK}>OK</Button>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default ApexDateTime;
