import React, { useState, useEffect } from 'react';
import { Container, Paper, 
         Table, TableBody, 
         TableCell, TableContainer, 
         TableHead, TableRow,
         Avatar, Box, Button,
         Select, MenuItem, 
         Typography, Grid2 
       } from '@mui/material';
import { getJobs } from '../services/jobService';
import { getUsers } from '../services/userService';
import { getAlternates, createAlternate, updateAlternate } from '../services/alternatesService';

const AlternateWeapons = () => {
    const [jobs, setJobs] = useState([]);  
    const [users, setUsers] = useState([]);
    const [alternates, setAlternates] = useState([]);

    const [newRaider, setNewRaider] = useState('');
    const [newAlt1, setNewAlt1] = useState('');
    const [newAlt2, setNewAlt2] = useState('');
    const [loggedInUserName, setLoggedInUserName] = useState('');
    
    const [isAdmin, setIsAdmin] = useState(false);    
    const [loading, setLoading] = useState(true);

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
    };

    const fetchLoggedInUserName = async () => {
        const storedUserInfo = localStorage.getItem('currentUser');
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            setLoggedInUserName(parsedInfo.name);
        }
        
    };
    const fetchJobs = async () => {
        const jobs = await getJobs();
        setJobs(jobs);
    };

    const fetchUsers = async () => {
        const users = await getUsers();
        setUsers(users.filter(user => user.raidmember));
    };

    const fetchAlternates = async () => {
        const alternates = await getAlternates();
        setAlternates(alternates);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchLoggedInUserName();
            await fetchAdminStatus();
            await Promise.all([fetchJobs(), fetchUsers()]);
            await fetchAlternates();
            setLoading(false);    
        };
        fetchData();
    }, []);

    const handleChange = (event, userId, altNumber, alternateid) => {
        const value = event.target.value;
        handleSave(alternateid, altNumber, value);
    };

    const getUserImage = (userid) => {
        const user = users.find(user => user.id === userid);
        return user ? user.lodestoneimage : '';
    }
    const getUserName = (userid) => {
        const user = users.find(user => user.id === userid);  
        return user ? user.name : '';
    }

    const handleSave = async (alternateid, alt, value) => {
        if (alt === 'alt1') { 
            await updateAlternate(alternateid, { first_choice: value });
        } else {
            await updateAlternate(alternateid, { second_choice: value });
        }
        fetchAlternates();
    };

    const handleCreate = async () => {
        if (!isAdmin) {
            alert('You do not have permission to create alternates.');
            return;
        }

         // Check if the selected raider already exists in alternates
        const raiderExists = alternates.some(alternate => alternate.userid === newRaider);

        if (raiderExists) {
            alert('This raider already has an alternate. Please select a different raider.');
            return;
        }

        // Validate if all fields are selected
        if (!newRaider || !newAlt1 || !newAlt2) {
            alert('Please select a Raider, Alternate 1, and Alternate 2');
            return;
        }

        // Proceed to create the new alternate
        await createAlternate({
            userid: newRaider,
            first_choice: newAlt1,
            second_choice: newAlt2
        });

        // Reset state and refresh the alternates list
        setNewRaider('');
        setNewAlt1('');
        setNewAlt2('');
        fetchAlternates();
    };

    if (loading) {
        return <Typography variant="h4">Loading...</Typography>;
    }
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Alternate Weapons Management
            </Typography>
        {isAdmin && (
            <Paper sx={{ padding: 2, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Add New Alternate
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12} sm={4}>
                        <Select
                            value={newRaider}
                            onChange={(e) => setNewRaider(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Select Raider</em>
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar 
                                            src={user.lodestoneimage} 
                                            alt={user.name} 
                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                        />
                                        {user.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid2>
                    <Grid2 item xs={12} sm={4}>
                        <Select
                            value={newAlt1}
                            onChange={(e) => setNewAlt1(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Alternate 1</em>
                            </MenuItem>
                            {jobs.map((job) => (
                                <MenuItem key={job.id} value={job.name}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar 
                                            src={job.jobimage} 
                                            alt={job.name} 
                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                        />
                                        {job.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid2>
                    <Grid2 item xs={12} sm={4}>
                        <Select
                            value={newAlt2}
                            onChange={(e) => setNewAlt2(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Alternate 2</em>
                            </MenuItem>
                            {jobs.map((job) => (
                                <MenuItem key={job.id} value={job.name}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar 
                                            src={job.jobimage} 
                                            alt={job.name} 
                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                        />
                                        {job.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid2>
                    <Grid2 item xs={12} sm={12}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleCreate}
                            disabled={!isAdmin}
                        >
                            Save New Alternate
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>)}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Raider</TableCell>
                            <TableCell>Alternate 1</TableCell>
                            <TableCell>Alternate 2</TableCell>
                            <TableCell>Date Modified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {alternates.map((alternate) => (                       
                        <TableRow key={alternate.userid}>
                            <TableCell> 
                                <Box display="flex" alignItems="center">
                                    <Avatar 
                                        src={getUserImage(alternate.userid)} 
                                        alt={getUserName(alternate.userid)} 
                                        sx={{ width: 24, height: 24, marginRight: 1 }}
                                    />
                                    { getUserName(alternate.userid)}
                                </Box>
                            </TableCell>
                            {(() => {
                                const isEditable = isAdmin || loggedInUserName === getUserName(alternate.userid);                     
                                return (
                                    <TableCell>
                                        {isEditable ? (
                                        <Select
                                            value={alternate.first_choice || ''}
                                            onChange={(event) => handleChange(event, alternate.userid, 'alt1', alternate.id)}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {jobs.map((job) => (
                                                <MenuItem key={job.id} value={job.name}>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar 
                                                            src={job.jobimage} 
                                                            alt={job.name} 
                                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                                        />
                                                        {job.name}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        ) : (
                                            <Box display="flex" alignItems="center">
                                                <Avatar 
                                                    src={jobs.find(job => job.name === alternate.first_choice)?.jobimage}
                                                    alt={alternate.first_choice}  
                                                    sx={{ width: 24, height: 24, marginRight: 1 }}
                                                />
                                            {alternate.first_choice}
                                            </Box>
                                        )
                                        }                                         
                                    </TableCell>
                                );
                            })()}
                            {(() => {
                                const isEditable = isAdmin || loggedInUserName === getUserName(alternate.userid);                     
                                return (
                                    <TableCell>
                                        {isEditable ? (
                                        <Select
                                            value={alternate.second_choice || ''}
                                            onChange={(event) => handleChange(event, alternate.userid, 'alt2', alternate.id)}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {jobs.map((job) => (
                                                <MenuItem key={job.id} value={job.name}>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar 
                                                            src={job.jobimage} 
                                                            alt={job.name} 
                                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                                        />
                                                        {job.name}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        ) : (
                                            <Box display="flex" alignItems="center">
                                                <Avatar 
                                                    src={jobs.find(job => job.name === alternate.second_choice)?.jobimage}
                                                    alt={alternate.second_choice}  
                                                    sx={{ width: 24, height: 24, marginRight: 1 }}
                                                />
                                            {alternate.second_choice}
                                            </Box>
                                        )
                                        }                                         
                                    </TableCell>
                                );
                            })()}
                            <TableCell>
                                {new Date(alternate.updatedAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

                </Table>
            </TableContainer>
        </Container>
    );
};

export default AlternateWeapons;
