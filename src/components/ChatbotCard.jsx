// ChatbotCard.js
import React from 'react';
import { Box, Avatar, Typography, Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

const ChatbotCard = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/help');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 50, // Increase padding from bottom
        right: 50, // Increase padding from right
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        boxShadow: 3,
        borderRadius: 1,
        p: 1,
      }}
    >
      {/* <Avatar
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdZ9dExjxM5bzlQbdh_gLIt2cWMOzQmil8TA&s"
        alt="Chatbot Logo"
        sx={{ width: 48, height: 48, mr: 1 }}
      /> */}
      <Typography sx={{fontWeight: "bold"}} variant="body1">Chat with Us for Help!</Typography>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ ml: 1 }}
        onClick={handleChatClick}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};

export default ChatbotCard;
