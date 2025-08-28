import {
  FileDownload as DownloadIcon,
  Fullscreen as ExpandIcon,
  Refresh as ResetIcon,
  ViewComfy as ViewAllIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

// You'll need to install these dependencies:
// npm install html2canvas file-saver

const ParseTreeVisualizer = ({ tree }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const treeContainerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewMode, setViewMode] = useState("compact"); // 'compact' or 'expanded'
  const [nodeStats, setNodeStats] = useState({ total: 0, types: {} });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height: Math.max(height, 400) });
      setTranslate({ x: width / 2, y: 50 });
    }

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 400) });
      }
    };

    window.addEventListener("resize", handleResize);

    // Calculate tree statistics
    if (tree) {
      const stats = { total: 0, types: {} };
      countNodes(tree, stats);
      setNodeStats(stats);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [tree]);

  // Helper function to count nodes
  const countNodes = (node, stats) => {
    stats.total++;

    const type = node.name.split(":")[0];
    if (!stats.types[type]) {
      stats.types[type] = 0;
    }
    stats.types[type]++;

    node.children.forEach((child) => countNodes(child, stats));
  };

  const formatTreeData = (node) => {
    if (!node) return null;

    return {
      name: node.value ? `${node.name}: ${node.value}` : node.name,
      children: node.children.map((child) => formatTreeData(child)),
      attributes: {
        type: node.name.split(":")[0],
        value: node.value,
      },
    };
  };

  const formattedTree = formatTreeData(tree);

  // Custom node rendering
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    const nodeSize = viewMode === "compact" ? 18 : 24;
    const textSize = viewMode === "compact" ? 10 : 12;
    const labelOffset = viewMode === "compact" ? 25 : 32;
    const valueFontSize = viewMode === "compact" ? 9 : 11;

    return (
      <g>
        <circle
          r={nodeSize}
          fill={getNodeColor(nodeDatum.name)}
          onClick={toggleNode}
          strokeWidth={2}
          stroke="white"
          style={{ cursor: "pointer", transition: "all 0.3s ease" }}
        />
        <text
          fill="white"
          strokeWidth="0.5"
          stroke="white"
          fontSize={textSize}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ pointerEvents: "none" }}
        >
          {getNodeLabel(nodeDatum.name)}
        </text>

        <text
          y={labelOffset}
          fill="#24292f"
          textAnchor="middle"
          fontSize={textSize}
          fontWeight="500"
          style={{ pointerEvents: "none" }}
        >
          {getNodeFullName(nodeDatum.name)}
        </text>

        {nodeDatum.attributes.value && viewMode === "expanded" && (
          <text
            y={labelOffset + 16}
            fill="#57606a"
            textAnchor="middle"
            fontSize={valueFontSize}
            fontStyle="italic"
            style={{ pointerEvents: "none" }}
          >
            value: "{nodeDatum.attributes.value}"
          </text>
        )}
      </g>
    );
  };

  // Helper functions for node rendering
  const getNodeLabel = (name) => {
    if (name.startsWith("E")) return "E";
    if (name.startsWith("T")) return "T";
    if (name.startsWith("F")) return "F";
    if (name.includes("PLUS")) return "+";
    if (name.includes("MULT")) return "*";
    if (name.includes("PAREN")) return name.includes("L") ? "(" : ")";
    if (name.includes("ID:")) {
      const match = name.match(/ID: (.+)/);
      return match ? match[1] : "id";
    }
    if (name.includes("Ɛ")) return "ε";
    return name.split(":")[0];
  };

  const getNodeFullName = (name) => {
    if (name.includes(":")) {
      return name.split(":")[0];
    }
    return name;
  };

  // Get color based on node type
  const getNodeColor = (name) => {
    if (name.startsWith("E")) return "#0969da"; // blue
    if (name.startsWith("T")) return "#8250df"; // purple
    if (name.startsWith("F")) return "#2da44e"; // green
    if (name.includes("PLUS")) return "#cf222e"; // red
    if (name.includes("MULT")) return "#bf8700"; // yellow
    if (name.includes("ID")) return "#0969da"; // blue
    if (name.includes("PAREN")) return "#6e7781"; // gray
    if (name.includes("Ɛ")) return "#57606a"; // dark gray
    return "#0969da"; // blue
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (treeContainerRef.current) {
        // Add white background
        const originalBackground = treeContainerRef.current.style.background;
        treeContainerRef.current.style.background = "white";

        const canvas = await html2canvas(treeContainerRef.current, {
          backgroundColor: "#ffffff",
          scale: 2, // Higher quality
          logging: false,
          useCORS: true,
        });

        // Restore original background
        treeContainerRef.current.style.background = originalBackground;

        // Download image
        const image = canvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement("a");
        link.href = image;
        link.download = `parse-tree-${new Date().getTime()}.jpg`;
        link.click();
      }
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.5));
  };

  const handleReset = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 50 });
      setZoom(1);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) =>
      prevMode === "compact" ? "expanded" : "compact"
    );
  };

  if (!tree) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1">No parse tree available</Typography>
      </Box>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{ border: "1px solid rgba(27, 31, 36, 0.15)", borderRadius: 2 }}
    >
      <CardHeader
        title={<Typography variant="h4">Parse Tree Visualization</Typography>}
        action={
          <ButtonGroup size="small" sx={{ mr: 1 }}>
            <Tooltip title="Toggle view mode">
              <Button
                onClick={toggleViewMode}
                variant="outlined"
                startIcon={
                  viewMode === "compact" ? <ExpandIcon /> : <ViewAllIcon />
                }
              >
                {viewMode === "compact" ? "Expanded" : "Compact"}
              </Button>
            </Tooltip>
            <Tooltip title="Download as JPG">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                variant="outlined"
                startIcon={
                  isDownloading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DownloadIcon />
                  )
                }
              >
                Download
              </Button>
            </Tooltip>
          </ButtonGroup>
        }
        sx={{
          borderBottom: "1px solid rgba(27, 31, 36, 0.15)",
          backgroundColor: "#f6f8fa",
          pb: 1,
        }}
      />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Tree Stats: {nodeStats.total} nodes
          </Typography>

          {Object.entries(nodeStats.types).map(([type, count]) => (
            <Chip
              key={type}
              label={`${type}: ${count}`}
              size="small"
              sx={{
                backgroundColor: getNodeColor(type),
                color: "white",
                fontWeight: "bold",
                fontSize: "11px",
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Zoom In">
              <Button onClick={handleZoomIn}>
                <ZoomInIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <Button onClick={handleZoomOut}>
                <ZoomOutIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Reset View">
              <Button onClick={handleReset}>
                <ResetIcon fontSize="small" />
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Box sx={{ width: 100, mr: 1 }}>
            <Slider
              size="small"
              value={zoom}
              min={0.5}
              max={3}
              step={0.1}
              onChange={(_, newValue) => setZoom(newValue)}
              aria-labelledby="zoom-slider"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {Math.round(zoom * 100)}%
          </Typography>
        </Box>
      </Box>

      <Box
        ref={containerRef}
        sx={{
          height: 450,
          position: "relative",
          border: "1px solid rgba(27, 31, 36, 0.15)",
          borderRadius: 1,
          m: 2,
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          ref={treeContainerRef}
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f6f8fa",
            "& .rd3t-link": {
              stroke: "#24292e",
              strokeWidth: 1.5,
              strokeOpacity: 0.5,
            },
          }}
        >
          <Tree
            data={formattedTree}
            orientation="vertical"
            pathFunc="step"
            translate={translate}
            zoom={zoom}
            renderCustomNodeElement={renderCustomNodeElement}
            separation={{
              siblings: viewMode === "compact" ? 1.2 : 1.5,
              nonSiblings: viewMode === "compact" ? 2 : 2.5,
            }}
            nodeSize={{
              x: viewMode === "compact" ? 100 : 150,
              y: viewMode === "compact" ? 60 : 80,
            }}
            zoomable={true}
            onUpdate={(evt) => {
              setTranslate(evt.translate);
              setZoom(evt.zoom);
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "4px 8px",
            borderRadius: 1,
            border: "1px solid rgba(27, 31, 36, 0.15)",
            fontSize: "12px",
            color: "text.secondary",
          }}
        >
          <Typography variant="caption">
            Drag to pan • Scroll to zoom • Click nodes to expand
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ParseTreeVisualizer;
