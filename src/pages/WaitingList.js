import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Chip, Avatar, Grid, Container } from '@mui/material';
import { getUsers } from '../services/userService';
const sections = [
    'Accessory Upgrade',
    'Equipment Upgrade',
    'Equipment Coffer',
    'Weapon Coffer'
];

const WaitingList = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});

    useEffect(() => {
        getUsers().then(data => setUsers(data));
    }, []);

    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
    };

    const toggleUserSelection = (section, userId) => {
        setSelectedUsers(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [userId]: !prev[section]?.[userId]
            }
        }));
    };

    return (
        <Container>
            <h1>Waiting List</h1>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Floor 1" />
                <Tab label="Floor 2" />
                <Tab label="Floor 3" />
                <Tab label="Floor 4" />
            </Tabs>
            <Grid container spacing={3} sx={{ marginTop: '20px' }}>
                {sections.map(section => (
                    <Grid item xs={12} key={section}>
                        <h2>{section}</h2>
                        <Grid container spacing={1}>
                            {users.map(user => (
                                <Grid item key={user.id}>
                                    <Chip
                                        avatar={<Avatar alt={user.name} src={user.lodestoneimage} />}
                                        label={user.name}
                                        clickable
                                        color={selectedUsers[section]?.[user.id] ? 'primary' : 'default'}
                                        onClick={() => toggleUserSelection(section, user.id)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default WaitingList;
