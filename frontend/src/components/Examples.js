import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { mockExamples } from "../mockData";

const API_URL = "http://localhost:5000/api";

const Examples = ({ onExampleClick }) => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const response = await axios.get(`${API_URL}/examples`);
        setExamples(response.data.examples);
      } catch (error) {
        console.warn("Error fetching examples, using mock data:", error);
        setExamples(mockExamples);
      } finally {
        setLoading(false);
      }
    };

    fetchExamples();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
        <CircularProgress size={16} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Try these examples:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {examples.map((example, index) => (
          <Chip
            key={index}
            label={example}
            onClick={() => onExampleClick(example)}
            variant="outlined"
            size="small"
            clickable
            sx={{
              borderRadius: 1,
              fontSize: "12px",
              backgroundColor: "#f6f8fa",
              border: "1px solid rgba(27, 31, 36, 0.15)",
              fontFamily: "monospace",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                borderColor: "rgba(27, 31, 36, 0.3)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Examples;
