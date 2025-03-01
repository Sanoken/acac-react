import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Tabs, 
    Tab, 
    Avatar, 
    Container, 
    IconButton,
    Typography, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Divider, 
    Chip,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    TablePagination
} from '@mui/material';
import { Delete as DeleteIcon } from "@mui/icons-material";
import { getUsers } from '../services/userService';
import { getRaidfloors } from '../services/raidfloorService';
import { getWaitinglists, createWaitinglist, deleteWaitinglist } from '../services/waitinglistService';
import { getRaiditems } from '../services/raiditemService';
import { createItemdrop, getItemDrops, deleteItemdrop } from '../services/itemdropService';



const WaitingList = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [raidfloors, setRaidfloors] = useState([]);
    const [waitinglists, setWaitinglist] = useState([]);
    const [raiditems, setRaiditems] = useState([]);
    const [selectedChips, setSelectedChips] = useState({});
    const [itemdrops, setItemdrops] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const isUserInWaitingList = useCallback((itemId, userId) => {
        return waitinglists.some(waitinglist => 
            waitinglist.Raiditem.id === itemId && waitinglist.User.id === userId
        );
    }, [waitinglists]);

    const fetchItemDrops = useCallback(async () => {
        const data = await getItemDrops();
        const filteredDrops = data.filter(drop => drop.Raiditem.floorid === raidfloors[activeTab]?.id);
        setItemdrops(filteredDrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, [activeTab, raidfloors]);
    
        
    const fetchAdminStatus = async () => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            // Check if user is in nine-admin group
            try
            {
                if (!parsedInfo.groups.includes('nine-admin')) {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                }
            } catch (error){return setIsAdmin(false);}
        } else {
            setIsAdmin(false);
        }
    }
    const fetchRaidItems = async () => {
            const data = await getRaiditems();
            setRaiditems(data.filter(item => item.haslist));
    };

    const fetchUsers = async () => {
        const data = await getUsers();  
        setUsers(data);
    }    
    const fetchRaidfloors = async () => {
        const data = await getRaidfloors();
        setRaidfloors(data.sort((a, b) => a.order - b.order));
    };
    const fetchWaitinglist = async () => {
            const data = await getWaitinglists();
            setWaitinglist(data);
    }
    const handleCreateWaitingList = (userid, raiditemid) => {
        createWaitinglist({ userid, raiditemid })
    }
    const handleDeleteWaitingList = (userid, raiditem) => {
        deleteWaitinglist(raiditem, userid);
    }
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCreateItemdrop = (itemData) => {
        createItemdrop(itemData);
    };

    const handleChipClick = (itemId, userId) => {
        const isEnabled = selectedChips[itemId] && selectedChips[itemId][userId];

        if (!isAdmin) {
            return;
        }
        if (isEnabled) {
            // If enabled, remove waiting list record
            handleDeleteWaitingList(userId, itemId);
           //        
            
        } else {
            // If disabled, create waiting list record
            handleCreateWaitingList(userId, itemId);
            handleCreateItemdrop({ itemid: itemId, userid: userId });   
        }
    
        // Toggle the state of the chip
        setSelectedChips(prevState => ({
            ...prevState,
            [itemId]: {
                ...prevState[itemId],
                [userId]: !isEnabled
            }
        }));
        setUpdateTrigger(prev => !prev);
    };

    const handleDeleteItemdrop = async (id) => {
        await deleteItemdrop(id);
        fetchRaidItems();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    useEffect(() => {
        fetchUsers();
        fetchRaidItems();
        fetchRaidfloors();
        fetchWaitinglist();
        fetchAdminStatus();
    }, [updateTrigger, activeTab, raidfloors]);

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
    }, [raiditems, users, isUserInWaitingList]);

    useEffect(() => {
        fetchItemDrops();
    }, [activeTab, raidfloors, fetchItemDrops]);

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
                    <Typography variant="body2" sx={{ marginBottom: 2 }} dangerouslySetInnerHTML={{ __html: raidfloor.description }} />
                    <Divider sx={{ marginBottom: 2 }} />
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
                                        />
                                    </ListItem>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, paddingLeft: 7 }}>
                                        {users
                                            .filter(user => user.raidmember)
                                            .map(user => {                                                
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

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Raider</TableCell>
                            <TableCell>Date Received</TableCell>
                            {isAdmin && (
                            <TableCell>Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemdrops.map((drop, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                <Chip 
                                    avatar={<Avatar src={drop.Raiditem.raidimage} alt={drop.Raiditem.name} />}
                                    label={drop.Raiditem.name}                                    
                                    sx={{ marginBottom: 1 }}
                                />
                                </TableCell>
                                <TableCell>
                                <Chip 
                                    avatar={<Avatar src={users.find(user => user.id === drop.userid)?.lodestoneimage} alt={users.find(user => user.id === drop.userid)?.name} />}
                                    label={users.find(user => user.id === drop.userid)?.name}                                 
                                    sx={{ marginBottom: 1 }}
                                />
                                </TableCell>
                                <TableCell>{new Date(drop.createdAt).toLocaleDateString()}</TableCell>
                                {isAdmin && (
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDeleteItemdrop(drop.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={itemdrops.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
        </Container>
    );
};

export default WaitingList;
