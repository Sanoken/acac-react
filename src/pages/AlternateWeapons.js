import React, { useState, useEffect } from 'react';
import { Container, Paper, 
         Table, TableBody, 
         TableCell, TableContainer, 
         TableHead, TableRow,
         Avatar, Box,
         Select, MenuItem 
       } from '@mui/material';
import { getJobs } from '../services/jobService';
import { getUsers } from '../services/userService';

const AlternateWeapons = () => {
    const [jobs, setJobs] = useState([]);  
    const [users, setUsers] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState({}); 

    const fetchJobs = async () => {
        const jobs = await getJobs();
        setJobs(jobs);
    };

    const fetchUsers = async () => {
        const users = await getUsers();
        setUsers(users.filter(user => user.raidmember));
    };

    useEffect(() => {
        fetchJobs();
        fetchUsers();
    }, []);

    const handleChange = (event, userId, altNumber) => {
        const value = event.target.value;
        setSelectedJobs(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [altNumber]: value
            }
        }));
    };

    return (
        <Container>
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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell> 
                                    <Box display="flex" alignItems="center">
                                        <Avatar 
                                            src={user.lodestoneimage} 
                                            alt={user.name} 
                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                        />
                                        {user.name}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={selectedJobs[user.id]?.alt1 || ''}
                                        onChange={(event) => handleChange(event, user.id, 'alt1')}
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
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={selectedJobs[user.id]?.alt2 || ''}
                                        onChange={(event) => handleChange(event, user.id, 'alt2')}
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
                                </TableCell>
                                <TableCell>
                                    {/* Placeholder for Date Modified */}
                                    TBD
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
