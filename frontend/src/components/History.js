import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

const History = ({ history, onItemClick, onClose }) => {
  if (!history || history.length === 0) {
    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">History</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          No history available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">History</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List dense sx={{ maxHeight: "70vh", overflow: "auto" }}>
        {history.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem
              button
              onClick={() => onItemClick(item)}
              sx={{
                borderLeft: 3,
                borderColor: item.is_accepted ? "success.main" : "error.main",
                my: 1,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {item.input}
                    </Typography>
                    <Chip
                      size="small"
                      label={item.is_accepted ? "Valid" : "Invalid"}
                      color={item.is_accepted ? "success" : "error"}
                    />
                  </Box>
                }
                secondary={
                  item.error ? (
                    <Typography variant="caption" color="error.main" noWrap>
                      {item.error}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {item.tokens?.length || 0} tokens found
                    </Typography>
                  )
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default History;
