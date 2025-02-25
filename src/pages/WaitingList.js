import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Tabs, 
    Tab, 
    Avatar, 
    Container, 
    Typography, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Divider, 
    Chip 
} from '@mui/material';
import { getUsers } from '../services/userService';
import { getRaidfloors } from '../services/raidfloorService';
import { getWaitinglists, createWaitinglist, deleteWaitinglist } from '../services/waitinglistService';
import { getRaiditems } from '../services/raiditemService';

const WaitingList = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [raidfloors, setRaidfloors] = useState([]);
    const [waitinglists, setWaitinglist] = useState([]);
    const [raiditems, setRaiditems] = useState([]);
    const [selectedChips, setSelectedChips] = useState({});

    useEffect(() => {
        getUsers().then(data => setUsers(data));
        getRaidfloors().then(data => setRaidfloors(data.sort((a, b) => a.order - b.order)));
        getWaitinglists().then(data => setWaitinglist(data));
        getRaiditems().then(data => setRaiditems(data));
    }, []);

    useEffect(() => {
        // Initialize selectedChips state for each item
        const initialSelected = {};
        raiditems.forEach(item => {
            initialSelected[item.id] = {};
            users.forEach(user => {
                initialSelected[item.id][user.id] = isUserInWaitingList(item.id, user.id);
            });
        });
        setSelectedChips(initialSelected);
    }, [raiditems, users]);

    const handleCreateWaitingList = (userid, raiditemid) => {
        createWaitinglist({ userid, raiditemid })
    }
    const handleDeleteWaitingList = (userid, raiditem) => {
        deleteWaitinglist(raiditem,userid);
    }
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleChipClick = (itemId, userId) => {
        const isEnabled = selectedChips[itemId] && selectedChips[itemId][userId];
    
        if (isEnabled) {
            // If enabled, call handleDeleteWaitingList
            handleDeleteWaitingList(userId, itemId);
        } else {
            // If disabled, call handleCreateWaitingList
            handleCreateWaitingList(userId, itemId);
        }
    
        // Toggle the state of the chip
        setSelectedChips(prevState => ({
            ...prevState,
            [itemId]: {
                ...prevState[itemId],
                [userId]: !isEnabled
            }
        }));
    };

    const isUserInWaitingList = (itemId, userId) => {
        return waitinglists.some(waitinglist => 
            waitinglist.raiditemid === itemId && waitinglist.userid === userId
        );
    };

    return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    {raidfloors.map((raidfloor, index) => (
                        <Tab 
                            key={raidfloor.id} 
                            label={
                                <Box display="flex" alignItems="center">
                                    <Avatar 
                                        src={raidfloor.floorimage} 
                                        alt={raidfloor.name} 
                                        sx={{ width: 24, height: 24, marginRight: 1 }}
                                    />
                                    {raidfloor.name}
                                </Box>
                            }
                        />
                    ))}
                </Tabs>
            </Box>

            {raidfloors.map((raidfloor, index) => (
                <Box key={raidfloor.id} hidden={activeTab !== index}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        {raidfloor.name} Waiting List
                    </Typography>
                    <List>
                        {raiditems
                            .filter(item => item.floorid === raidfloor.id)
                            .map(item => (
                                <React.Fragment key={item.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={item.raidimage} 
                                                alt={item.name} 
                                            />
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={item.name} 
                                            secondary={`Requested by: ${item.requestedBy}`}
                                        />
                                    </ListItem>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, paddingLeft: 7 }}>
                                        {users
                                            .filter(user => user.raidmember)
                                            .map(user => {
                                                const isDisabled = isUserInWaitingList(item.id, user.id);
                                                return (
                                                    <Chip 
                                                        key={user.id}
                                                        avatar={<Avatar src={user.lodestoneimage} alt={user.name} />}
                                                        label={user.name}
                                                        clickable
                                                        color={selectedChips[item.id] && selectedChips[item.id][user.id] ? 'primary' : 'default'}
                                                        onClick={() => handleChipClick(item.id, user.id)}
                                                        sx={{ marginBottom: 1 }}
                                                    />
                                                );
                                            })
                                        }
                                    </Box>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                        ))}
                    </List>
                </Box>
            ))}
        </Container>
    );
};

export default WaitingList;
