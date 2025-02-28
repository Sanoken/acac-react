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
import { getAlternates, createAlternate, deleteAlternate, updateAlternate } from '../services/alternatesService';

const AlternateWeapons = () => {
    const [jobs, setJobs] = useState([]);  
    const [users, setUsers] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState({}); 
    const [alternates, setAlternates] = useState([]);

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
        fetchJobs();
        fetchUsers();
        fetchAlternates();
    }, []);

    const handleChange = (event, userId, altNumber, alternateid) => {
        const value = event.target.value;
        setSelectedJobs(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [altNumber]: value
            }
        }));
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
        }
        else {
            await updateAlternate(alternateid, { second_choice: value });
        }
        fetchAlternates();
    }
    
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
                                <TableCell>
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
                                </TableCell>
                                <TableCell>
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
                                </TableCell>
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
