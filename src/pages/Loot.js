import React, { useState, useEffect, useCallback } from 'react';
import { getItemDrops } from '../services/itemdropService';
import { getRaidfloors } from '../services/raidfloorService';
import { getUsers } from '../services/userService';
import { 
    Box, 
    Tabs, 
    Tab, 
    Avatar, 
    Container, 
    Typography, 
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

const Loot = () => {
    const [itemdrops, setItemdrops] = useState([]);
    const [raidfloors, setRaidfloors] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [users, setUsers] = useState([]);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchUsers = async () => {
        const data = await getUsers();  
        setUsers(data);
    };    

    const fetchRaidfloors = async () => {
        const data = await getRaidfloors();
        setRaidfloors(data.sort((a, b) => a.order - b.order));
    };

    const fetchItemDrops = useCallback(async () => {
        const data = await getItemDrops();
        const filteredDrops = data.filter(drop => drop.Raiditem.floorid === raidfloors[activeTab]?.id);
        setItemdrops(filteredDrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, [activeTab, raidfloors]);
        
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0); // Reset page on tab change
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
        fetchRaidfloors();
        fetchItemDrops();
    }, [activeTab, fetchItemDrops]);

    return (
        <Container>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    {raidfloors.map((raidfloor) => (
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

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Raider</TableCell>
                            <TableCell>Date Received</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemdrops
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((drop, index) => (
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
                                </TableRow>
                            ))
                        }
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
}

export default Loot;