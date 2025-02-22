import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
    const { darkMode } = useContext(ThemeContext);

    return (
        <Box sx={{
            width: '100%',
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
            color: darkMode ? '#ffffff' : '#000000',
            padding: '10px',
            textAlign: 'right',
            position: 'fixed',
            bottom: 0,  // Sticks to the bottom of the viewport
            left: 0,    // Anchors to the left side
            right: 0,   // Anchors to the right side
            zIndex: 10  // Ensures it's above other components
        }}>
            <Typography variant="body2" color="textSecondary">
                Tuesday (9:30pm EST — 12am EST) Wednesday (9:30pm EST — 12am EST) Sunday (9:30pm EST — 12am EST)
            </Typography>
        </Box>
    );
};

export default Footer;
