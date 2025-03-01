import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";
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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Loot = () => {
    const { darkMode } = useContext(ThemeContext);

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
        if (activeTab === 0) {
            setItemdrops(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
            const filteredDrops = data.filter(drop => drop.Raiditem.floorid === raidfloors[activeTab - 1]?.id);
            setItemdrops(filteredDrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
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

    // Prepare data for the bar chart
    const getBarChartData = () => {
        const countMap = {};

        itemdrops.forEach(drop => {
            const userName = users.find(user => user.id === drop.userid)?.name || 'Unknown';
            countMap[userName] = (countMap[userName] || 0) + 1;
        });

        return Object.entries(countMap).map(([name, count]) => ({ name, count }));
    };

    return (
        <Container>
            {/* Bar Chart */}
            <Box sx={{ width: '100%', height: 300, marginBottom: 4 }}>
                <ResponsiveContainer>
                    <BarChart data={getBarChartData()}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={darkMode ? "#BB86FC" : "#8884d8"} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={darkMode ? "#03DAC6" : "#82ca9d"} stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                        <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                        <YAxis allowDecimals={false} stroke={darkMode ? "#fff" : "#000"} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }} 
                        />
                        <Bar 
                            dataKey="count" 
                            fill="url(#colorUv)" 
                            barSize={30} 
                            radius={[10, 10, 0, 0]} // Rounded corners
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="All Items" />
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

            {/* Table */}
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