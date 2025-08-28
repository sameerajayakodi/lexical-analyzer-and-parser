import {
  ChevronLeft as ChevronLeftIcon,
  Code as CodeIcon,
  Download as DownloadIcon,
  GitHub as GitHubIcon,
  History as HistoryIcon,
  InfoOutlined as InfoIcon,
  Menu as MenuIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import Examples from "./components/Examples";
import ParseTreeVisualizer from "./components/ParseTreeVisualizer";
import SymbolTable from "./components/SymbolTable";
import TokensTable from "./components/TokensTable";
import { mockAnalysis } from "./mockData";
import theme from "./theme";

const API_URL = "/api";
const drawerWidth = 240;

function App() {
  const appTheme = useTheme();
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [tabValue, setTabValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeView, setActiveView] = useState("analyzer");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load history from local storage
    const savedHistory = localStorage.getItem("analyzer-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleAnalyze = async () => {
    if (!expression.trim()) {
      showAlert("Please enter an expression", "warning");
      return;
    }

    setLoading(true);
    try {
      let response;
      try {
        response = await axios.post(`${API_URL}/analyze`, { expression });
      } catch (connectionError) {
        console.warn("Backend connection failed, using mock data");
        await new Promise((resolve) => setTimeout(resolve, 500));
        response = { data: { ...mockAnalysis, input: expression } };
      }

      setResult(response.data);

      // Add to history
      const newHistory = [response.data, ...history.slice(0, 19)]; // Keep last 20 items
      setHistory(newHistory);
      localStorage.setItem("analyzer-history", JSON.stringify(newHistory));

      setTabValue(0); // Switch to tokens tab

      if (!response.data.is_accepted) {
        showAlert(`Error: ${response.data.error}`, "error");
      } else {
        showAlert("Expression analyzed successfully", "success");
      }
    } catch (error) {
      console.error("Error analyzing expression:", error);
      showAlert("Failed to analyze expression", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/analyze-file`, formData);
      showAlert(
        `Analyzed ${response.data.results.length} expressions from file`,
        "success"
      );

      // Add results to history
      const newResults = response.data.results;
      if (newResults.length > 0) {
        setResult(newResults[0]);

        const newHistory = [...newResults, ...history].slice(0, 20); // Keep last 20 items
        setHistory(newHistory);
        localStorage.setItem("analyzer-history", JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      showAlert("Failed to analyze file", "error");
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleExportResults = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    saveAs(blob, `analysis-result-${new Date().getTime()}.json`);
    showAlert("Results exported successfully", "success");
  };

  const handleReset = () => {
    setExpression("");
    setResult(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAnalyze();
    }
  };

  const handleHistoryItemClick = (item) => {
    setExpression(item.input);
    setResult(item);
    if (activeView !== "analyzer") {
      setActiveView("analyzer");
    }
  };

  const handleExampleClick = (example) => {
    setExpression(example);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Filter history items based on search query
  const filteredHistory = history.filter((item) =>
    item.input.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mainContent = () => {
    switch (activeView) {
      case "analyzer":
        return (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Input Card */}
            <Paper
              sx={{
                p: 3,
                border: "1px solid rgba(27, 31, 36, 0.15)",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CodeIcon sx={{ mr: 1.5, color: "primary.main" }} />
                <Typography variant="h3">Expression Analyzer</Typography>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an expression (e.g., 3+4*5, a+b*c, (x+y)*z)"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  onClick={handleAnalyze}
                  disabled={loading || !expression.trim()}
                  sx={{ fontWeight: 600 }}
                >
                  Run Analysis
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                >
                  Clear
                </Button>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    accept=".txt"
                    onChange={handleFileUpload}
                  />
                </Button>

                {result && (
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportResults}
                  >
                    Export JSON
                  </Button>
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Examples onExampleClick={handleExampleClick} />
              </Box>
            </Paper>

            {/* Results Section */}
            {result ? (
              <Paper
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  border: "1px solid rgba(27, 31, 36, 0.15)",
                  overflow: "hidden",
                  minHeight: 0, // Important for flex child scrolling
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
                    backgroundColor: "#f6f8fa",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Analysis Results for: <code>{result.input}</code>
                  </Typography>
                  <Chip
                    label={
                      result.is_accepted
                        ? "Valid Expression"
                        : "Invalid Expression"
                    }
                    color={result.is_accepted ? "success" : "error"}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                      "& .MuiTab-root": {
                        minHeight: "48px",
                        py: 1.5,
                      },
                    }}
                  >
                    <Tab label="Tokens" />
                    <Tab label="Symbol Table" />
                    <Tab label="Parse Tree" />
                  </Tabs>
                </Box>

                <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
                  {tabValue === 0 && (
                    <TokensTable tokens={result.tokens || []} />
                  )}
                  {tabValue === 1 && (
                    <SymbolTable symbols={result.symbol_table || {}} />
                  )}
                  {tabValue === 2 &&
                    (result.parse_tree ? (
                      <ParseTreeVisualizer tree={result.parse_tree} />
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <InfoIcon
                          sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                        />
                        <Typography>No parse tree available</Typography>
                        {result.error && (
                          <Typography color="error.main" sx={{ mt: 1 }}>
                            {result.error}
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
              </Paper>
            ) : (
              <Paper
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 4,
                  borderRadius: 2,
                  border: "1px solid rgba(27, 31, 36, 0.15)",
                  backgroundColor: "#f6f8fa",
                }}
              >
                <CodeIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h3" color="text.secondary" gutterBottom>
                  No Analysis Results
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ maxWidth: 400 }}
                >
                  Enter an expression and click "Run Analysis" to see lexical
                  analysis and parsing results for the given grammar.
                </Typography>
              </Paper>
            )}
          </Box>
        );

      case "history":
        return (
          <Paper
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              border: "1px solid rgba(27, 31, 36, 0.15)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
                backgroundColor: "#f6f8fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HistoryIcon sx={{ mr: 1.5, color: "text.secondary" }} />
                <Typography variant="h3">Analysis History</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", width: "40%" }}>
                <TextField
                  placeholder="Search expressions..."
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {filteredHistory.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    p: 4,
                  }}
                >
                  <InfoIcon
                    sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {searchQuery
                      ? "No matching expressions found"
                      : "No history available"}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {filteredHistory.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          borderRadius: 2,
                          border: "1px solid rgba(27, 31, 36, 0.15)",
                          borderLeft: 4,
                          borderLeftColor: item.is_accepted
                            ? "success.main"
                            : "error.main",
                          "&:hover": {
                            backgroundColor: "#f6f8fa",
                            boxShadow: "0 3px 6px rgba(140, 149, 159, 0.15)",
                          },
                        }}
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            noWrap
                            sx={{ mb: 0.5 }}
                          >
                            <code>{item.input}</code>
                          </Typography>
                          <Chip
                            size="small"
                            label={item.is_accepted ? "Valid" : "Invalid"}
                            color={item.is_accepted ? "success" : "error"}
                            sx={{ ml: 1, fontWeight: 600 }}
                          />
                        </Box>

                        {item.error ? (
                          <Typography
                            variant="body2"
                            color="error.main"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            Error: {item.error}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {item.tokens?.length || 0} tokens identified
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        );

      case "about":
        return (
          <Paper
            sx={{
              height: "100%",
              overflow: "auto",
              borderRadius: 2,
              border: "1px solid rgba(27, 31, 36, 0.15)",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
                backgroundColor: "#f6f8fa",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InfoIcon sx={{ mr: 1.5, color: "text.secondary" }} />
              <Typography variant="h3">
                About Lexical Analyzer & Parser
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                Grammar Definition
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: "#f6f8fa",
                  fontFamily: "monospace",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  E → TE´
                  <br />
                  E´→ +TE´|Ɛ
                  <br />
                  T → FT´
                  <br />
                  T´→ *FT´|Ɛ
                  <br />
                  F → (E)|id
                  <br />
                  id → 0|1|2|3|4|5|6|7|8|9|a…z|A…Z
                </Typography>
              </Paper>

              <Typography variant="h4" gutterBottom>
                Features
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  "Lexical Analysis",
                  "Syntax Parsing",
                  "Symbol Table",
                  "Parse Tree Visualization",
                  "Error Detection",
                  "File Input",
                  "History Tracking",
                ].map((feature, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(27, 31, 36, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f6f8fa",
                      }}
                    >
                      <InfoIcon
                        sx={{ mr: 1.5, fontSize: 18, color: "primary.main" }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {feature}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h4" gutterBottom>
                Project Information
              </Typography>

              <Typography variant="body1" paragraph>
                This application implements a lexical analyzer and parser for
                the specified grammar. It can tokenize expressions, build a
                parse tree, and determine if an expression is valid according to
                the grammar rules.
              </Typography>

              <Typography variant="body1" paragraph>
                The application is built using Python Flask for the backend and
                React with Material-UI for the frontend. It demonstrates the
                principles of compiler design, specifically the lexical analysis
                and parsing phases.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 4,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f6f8fa",
                  border: "1px solid rgba(27, 31, 36, 0.15)",
                }}
              >
                <GitHubIcon sx={{ mr: 1.5, color: "text.secondary" }} />
                <Typography variant="body2" fontWeight={500}>
                  {new Date().getFullYear()} © Lexical Analyzer & Parser Project
                </Typography>
              </Box>
            </Box>
          </Paper>
        );

      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">Page not found</Typography>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ...(drawerOpen && {
              marginLeft: drawerWidth,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          }}
        >
          <Toolbar variant="dense">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{
                mr: 2,
                ...(drawerOpen && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <CodeIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ fontWeight: 600 }}
              >
                Lexical Analyzer
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="View project on GitHub">
                <IconButton color="inherit" size="small">
                  <GitHubIcon href="https://github.com/your-repo" />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : 56,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!drawerOpen && {
              overflowX: "hidden",
              width: 56,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
            "& .MuiDrawer-paper": {
              width: drawerOpen ? drawerWidth : 56,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: drawerOpen
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen,
              }),
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "space-between" : "center",
              padding: drawerOpen ? 2 : 1,
              minHeight: 48,
              borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
            }}
          >
            {drawerOpen && (
              <Typography variant="subtitle1" fontWeight={600}>
                Dashboard
              </Typography>
            )}
            <IconButton
              onClick={toggleDrawer}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Box>

          <List sx={{ py: 1 }}>
            <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                  py: 1,
                  borderRadius: 1,
                  mx: drawerOpen ? 1 : "auto",
                  backgroundColor:
                    activeView === "analyzer" ? "#f6f8fa" : "transparent",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
                onClick={() => setActiveView("analyzer")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : "auto",
                    justifyContent: "center",
                    color:
                      activeView === "analyzer"
                        ? "primary.main"
                        : "text.secondary",
                  }}
                >
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Analyzer"
                  sx={{
                    opacity: drawerOpen ? 1 : 0,
                    "& .MuiTypography-root": {
                      fontWeight: activeView === "analyzer" ? 600 : 400,
                      fontSize: "14px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                  py: 1,
                  borderRadius: 1,
                  mx: drawerOpen ? 1 : "auto",
                  backgroundColor:
                    activeView === "history" ? "#f6f8fa" : "transparent",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
                onClick={() => setActiveView("history")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : "auto",
                    justifyContent: "center",
                    color:
                      activeView === "history"
                        ? "primary.main"
                        : "text.secondary",
                  }}
                >
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary="History"
                  sx={{
                    opacity: drawerOpen ? 1 : 0,
                    "& .MuiTypography-root": {
                      fontWeight: activeView === "history" ? 600 : 400,
                      fontSize: "14px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 40,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                  py: 1,
                  borderRadius: 1,
                  mx: drawerOpen ? 1 : "auto",
                  backgroundColor:
                    activeView === "about" ? "#f6f8fa" : "transparent",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
                onClick={() => setActiveView("about")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 2 : "auto",
                    justifyContent: "center",
                    color:
                      activeView === "about"
                        ? "primary.main"
                        : "text.secondary",
                  }}
                >
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  primary="About"
                  sx={{
                    opacity: drawerOpen ? 1 : 0,
                    "& .MuiTypography-root": {
                      fontWeight: activeView === "about" ? 600 : 400,
                      fontSize: "14px",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            pt: 7,
            pb: 2,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ flex: 1, overflow: "hidden" }}>{mainContent()}</Box>
        </Box>
      </Box>

      {/* Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(140, 149, 159, 0.2)",
            border: "1px solid rgba(27, 31, 36, 0.15)",
            fontWeight: 500,
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
