import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Chip, Avatar, Grid, Container } from '@mui/material';
import { getUsers } from '../services/userService';
import { getRaidfloors } from '../services/raidfloorService';

const sections = [
    'Accessory Upgrade',
    'Equipment Upgrade',
    'Equipment Coffer',
    'Weapon Coffer'
];

const WaitingList = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [raidfloors, setRaidfloors] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});

    useEffect(() => {
        getUsers().then(data => setUsers(data));
        getRaidfloors().then(data => setRaidfloors(data.sort((a, b) => a.order - b.order)));
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
                {raidfloors.map((raidfloor, index) => (
                    <Tab key={raidfloor.id} label={
                        <Box display="flex" alignItems="center">
                            <Avatar 
                                alt={raidfloor.name} 
                                src={raidfloor.floorimage} 
                                sx={{ width: 24, height: 24, marginRight: '8px' }} 
                            />
                            {raidfloor.name}
                        </Box>
                    } />
                ))}
            </Tabs>
            {raidfloors.map((floor, index) => (
                <div key={index} hidden={activeTab !== index}>
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
                </div>
            ))}
        </Container>
    );
};

export default WaitingList;
