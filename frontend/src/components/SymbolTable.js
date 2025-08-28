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

const SymbolTable = ({ symbols }) => {
  if (!symbols || Object.keys(symbols).length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1">No symbols available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Symbol Table
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
              <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Occurrences</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>First Position</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Scope</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(symbols).map(([symbol, info], index) => (
              <TableRow
                key={symbol}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f6f8fa" } }}
              >
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 1,
                      display: "inline-block",
                      fontWeight: 600,
                      backgroundColor: "#0969da",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {symbol}
                  </Box>
                </TableCell>
                <TableCell>{info.type}</TableCell>
                <TableCell>{info.occurrences}</TableCell>
                <TableCell>{JSON.stringify(info.first_position)}</TableCell>
                <TableCell>{info.scope}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SymbolTable;
