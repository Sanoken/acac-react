import React, { useState, useEffect } from 'react';
import { Container, Paper, 
         Table, TableBody, 
         TableCell, TableContainer, 
         TableHead, TableRow,
         Avatar, Box, Button,
         Select, MenuItem, 
         Typography, Grid2
         ,TextField, IconButton
       } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getJobs, deleteJob, createJob } from '../services/jobService';
import { getUsers } from '../services/userService';
import { getAlternates, createAlternate, updateAlternate } from '../services/alternatesService';

const AlternateWeapons = () => {
    const [jobs, setJobs] = useState([]);  
    const [users, setUsers] = useState([]);
    const [alternates, setAlternates] = useState([]);

    const [newRaider, setNewRaider] = useState('');
    const [newAlt1, setNewAlt1] = useState('');
    const [newAlt2, setNewAlt2] = useState('');
    const [newJobName, setNewJobName] = useState('');
    const [newJobImage, setNewJobImage] = useState('');
    const [loggedInUserName, setLoggedInUserName] = useState('');
    
    const [isAdmin, setIsAdmin] = useState(false);    

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
        setJobs(jobs.sort((a, b) => a.name.localeCompare(b.name)));
    };

    const fetchUsers = async () => {
        const users = await getUsers();
        setUsers(users.filter(user => user.raidmember).sort((a, b) => a.name.localeCompare(b.name)));
    };

    const fetchAlternates = async () => {
        const alternates = await getAlternates();
        setAlternates(alternates);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchAdminStatus();
            await fetchLoggedInUserName();
            await fetchJobs();
            await fetchUsers();
            await fetchAlternates();
        };
        fetchData();
    }, [fetchJobs, fetchUsers, fetchAlternates]);

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

    const handleCreateJob = async () => {
        if (!isAdmin) { 
            alert('You do not have permission to create jobs.');
            return;
        }
        const jobExists = jobs.some(job => job.name === newJobName);
        if (jobExists) {
            alert('This job already exists. Please select a different job name.');
            return;
        }
        if (!newJobName || !newJobImage) {
            alert('Please enter a Job Name and Job Image URL');
            return;
        }
        await createJob({
            name: newJobName,
            jobimage: newJobImage
        });
        setNewJobName('');
        setNewJobImage('');
        fetchJobs();
    }
    const handledeleteJob = async (id) => {
        if (!isAdmin) { 
            alert('You do not have permission to delete jobs.');
            return;
        }
        await deleteJob(id);
        fetchJobs();
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
            </Paper>
        )}
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
<br></br>

{isAdmin && (

            <Paper sx={{ padding: 2, marginBottom: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Add New Job
                </Typography>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12} sm={4}>
                        <TextField 
                            label="Job Name"  
                            value={newJobName}
                            onChange={(e) => setNewJobName(e.target.value)} 
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={4}>
                        <TextField 
                            label="Job Image" 
                            value={newJobImage}
                            onChange={(e) => setNewJobImage(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={12}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleCreateJob}
                            disabled={!isAdmin}
                        >
                            Save New Job
                        </Button>
                    </Grid2>
                </Grid2>
            </Paper>
)}
            <TableContainer component={Paper}>
            {isAdmin && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Job</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar 
                                            src={job.jobimage} 
                                            alt={job.name} 
                                            sx={{ width: 24, height: 24, marginRight: 1 }}
                                        />
                                        {job.name}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="secondary" onClick={() => handledeleteJob(job.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>      
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            </TableContainer>
            
        </Container>
    );
};

export default AlternateWeapons;
