import { createTheme } from "@mui/material/styles";

// GitHub-inspired theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0969da", // GitHub's blue
      light: "#2188ff",
      dark: "#044289",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6e7781", // GitHub's gray
      light: "#8b949e",
      dark: "#57606a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f6f8fa", // GitHub's background gray
      paper: "#ffffff",
    },
    error: {
      main: "#cf222e", // GitHub's red
      light: "#e5534b",
      dark: "#a40e26",
    },
    success: {
      main: "#2da44e", // GitHub's green
      light: "#56d364",
      dark: "#1a7f37",
    },
    warning: {
      main: "#bf8700", // GitHub's yellow
      light: "#e3b341",
      dark: "#9e6a03",
    },
    text: {
      primary: "#24292f", // GitHub's text color
      secondary: "#57606a",
      disabled: "#8b949e",
    },
    divider: "rgba(27, 31, 36, 0.15)",
    action: {
      active: "rgba(9, 105, 218, 0.6)",
      hover: "rgba(9, 105, 218, 0.08)",
      selected: "rgba(9, 105, 218, 0.16)",
      disabled: "rgba(9, 105, 218, 0.3)",
      disabledBackground: "rgba(9, 105, 218, 0.12)",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Helvetica",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
    ].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h5: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h6: {
      fontSize: "0.85rem",
      fontWeight: 600,
      lineHeight: 1.25,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    "none",
    "0 1px 0 rgba(27, 31, 36, 0.04)",
    "0 1px 0 rgba(27, 31, 36, 0.1)",
    "0 3px 6px rgba(140, 149, 159, 0.15)",
    "0 8px 24px rgba(140, 149, 159, 0.2)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
    "0 12px 28px rgba(140, 149, 159, 0.3)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.05)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "5px 16px",
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: 1.5,
          border: "1px solid rgba(27, 31, 36, 0.15)",
          boxShadow: "0 1px 0 rgba(27, 31, 36, 0.04)",
          transition: "all 0.2s cubic-bezier(0.3, 0, 0.5, 1)",
          "&:hover": {
            backgroundColor: "#f3f4f6",
            borderColor: "rgba(27, 31, 36, 0.15)",
          },
        },
        contained: {
          backgroundColor: "#f6f8fa",
          color: "#24292f",
          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        },
        containedPrimary: {
          backgroundColor: "#2da44e",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#2c974b",
          },
        },
        containedSecondary: {
          backgroundColor: "#6e7781",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#57606a",
          },
        },
        outlined: {
          borderColor: "rgba(27, 31, 36, 0.15)",
          "&:hover": {
            borderColor: "rgba(27, 31, 36, 0.15)",
            backgroundColor: "#f3f4f6",
          },
        },
        text: {
          "&:hover": {
            backgroundColor: "rgba(9, 105, 218, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 0 rgba(27, 31, 36, 0.04), 0 1px 3px rgba(27, 31, 36, 0.12)",
          border: "1px solid rgba(27, 31, 36, 0.15)",
        },
        outlined: {
          border: "1px solid rgba(27, 31, 36, 0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            transition: "border-color 0.15s ease-in-out",
            "& fieldset": {
              borderColor: "rgba(27, 31, 36, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(27, 31, 36, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0969da",
              borderWidth: 1,
            },
            "& input": {
              fontSize: "14px",
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: "#24292f",
          backgroundColor: "#f6f8fa",
          borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
        },
        root: {
          borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
          padding: "8px 16px",
          fontSize: "14px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "inset 0 -1px 0 rgba(27, 31, 36, 0.15)",
          backgroundColor: "#ffffff",
          color: "#24292f",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          boxShadow: "inset -1px 0 0 rgba(27, 31, 36, 0.15)",
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: "2px 8px",
          "&.Mui-selected": {
            backgroundColor: "#f6f8fa",
            color: "#24292f",
            fontWeight: 500,
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#f3f4f6",
          },
          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 0 rgba(27, 31, 36, 0.04), 0 1px 3px rgba(27, 31, 36, 0.12)",
          borderRadius: 6,
          border: "1px solid rgba(27, 31, 36, 0.15)",
          overflow: "hidden",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          backgroundColor: "#0969da",
        },
        root: {
          minHeight: "48px",
          "& .MuiTab-root": {
            fontWeight: 600,
            fontSize: "14px",
            "&.Mui-selected": {
              color: "#24292f",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          fontWeight: 500,
          backgroundColor: "#f6f8fa",
          borderRadius: 12,
        },
        outlined: {
          borderColor: "rgba(27, 31, 36, 0.15)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(27, 31, 36, 0.15)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: "1px solid rgba(27, 31, 36, 0.15)",
        },
        standardSuccess: {
          backgroundColor: "rgba(46, 160, 67, 0.1)",
          color: "#24292f",
        },
        standardError: {
          backgroundColor: "rgba(207, 34, 46, 0.1)",
          color: "#24292f",
        },
        standardWarning: {
          backgroundColor: "rgba(191, 135, 0, 0.1)",
          color: "#24292f",
        },
        standardInfo: {
          backgroundColor: "rgba(9, 105, 218, 0.1)",
          color: "#24292f",
        },
      },
    },
  },
});

export default theme;
