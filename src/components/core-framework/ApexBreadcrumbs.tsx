import React from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  Box,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface ApexBreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  fontSize?: string | number;
  textColor?: string;
  activeColor?: string;
  iconColor?: string;
  boldLast?: boolean;
  maxItems?: number; // collapse if too many
}

const ApexBreadcrumbs: React.FC<ApexBreadcrumbsProps> = ({
  items,
  separator = <NavigateNextIcon fontSize="small" />,
  fontSize = "0.9rem",
  textColor = "#555",
  activeColor = "#1976d2",
  iconColor = "#1976d2",
  boldLast = true,
  maxItems = 5,
}) => {
  return (
    <Breadcrumbs
      separator={separator}
      aria-label="breadcrumb"
      maxItems={maxItems}
      sx={{ fontSize }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const content = (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {item.icon && (
              <Box sx={{ color: iconColor, display: "flex" }}>{item.icon}</Box>
            )}
            <span>{item.label}</span>
          </Box>
        );

        if (isLast) {
          return (
            <Typography
              key={idx}
              component="span"
              sx={{
                fontSize,
                color: activeColor,
                fontWeight: boldLast ? 600 : 400,
              }}
            >
              {content}
            </Typography>
          );
        }

        return (
          <Link
            key={idx}
            underline="hover"
            color={textColor}
            href={item.href}
            onClick={item.onClick}
            sx={{ fontSize, cursor: "pointer" }}
          >
            {content}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default ApexBreadcrumbs;
