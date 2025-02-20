import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            backgroundColor: '#f5f5f5',
            padding: '10px',
            textAlign: 'right'
        }}>
            <Typography variant="body2" color="textSecondary">
                Tuesday (9:30pm EST — 12am EST) Wednesday (9:30pm EST — 12am EST) Sunday (9:30pm EST — 12am EST)
            </Typography>
        </Box>
    );
};

export default Footer;