import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const TokensTable = ({ tokens }) => {
  if (!tokens || tokens.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1">No tokens available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tokens Identified
      </Typography>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(27, 31, 36, 0.15)",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token, index) => (
              <TableRow
                key={index}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f6f8fa" } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      bgcolor: getTokenTypeColor(token.type),
                      color: "white",
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 10,
                      display: "inline-block",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {token.type}
                  </Box>
                </TableCell>
                <TableCell>
                  <code>{token.value}</code>
                </TableCell>
                <TableCell>{JSON.stringify(token.position)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Helper function to get color based on token type
const getTokenTypeColor = (type) => {
  switch (type) {
    case "ID":
      return "#2da44e"; // green
    case "PLUS":
      return "#0969da"; // blue
    case "MULT":
      return "#8250df"; // purple
    case "LPAREN":
    case "RPAREN":
      return "#6e7781"; // gray
    default:
      return "#57606a"; // dark gray
  }
};

export default TokensTable;
