import React, { useEffect, useState } from "react";
import {
    Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ToggleButton, TableSortLabel, Grid2
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService"; 
import { useNavigate } from "react-router-dom";

const Users = () => {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ name: "", discord: "", lodestoneid: "", lodestoneimage: "", raidmember: false, ninemember: false });
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            // Check if user is in nine-admin group
            try
            {
                if (!parsedInfo.groups.includes('nine-admin')) {
                    navigate('/');
                }
            } catch (error){return navigate('/');}
            
         } else {
            navigate('/');
         }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data.sort((a, b) => a.name.localeCompare(b.name)));
    };

    const handleOpen = (user = null) => {
        setEditingUser(user);
        setForm(user || { name: "", discord: "", lodestoneid: "", lodestoneimage: "", raidmember: false, ninemember: false });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
        setForm({ name: "", discord: "", lodestoneid: "", lodestoneimage: "", raidmember: false, ninemember: false });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (editingUser) {
            await updateUser(editingUser.id, form);
        } else {
            const newUser = await createUser({ id: uuidv4(), ...form });
            if (newUser) {
                setUsers([...users, newUser]);
            }
        }
        fetchUsers();
        handleClose();
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    const handleSort = () => {
        const isAsc = order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        const sortedUsers = [...users].sort((a, b) => {
            return isAsc 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
        });
        setUsers(sortedUsers);
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                User Management
            </Typography>

            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add User
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell sortDirection={order}>
                                <TableSortLabel
                                    active={true}
                                    direction={order}
                                    onClick={handleSort}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Discord</TableCell>
                            <TableCell>Lodestone ID</TableCell>
                            <TableCell>Raid Member</TableCell>
                            <TableCell>Nine Member</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar src={user.lodestoneimage} alt={user.name} />
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.discord}</TableCell>
                                <TableCell>{user.lodestoneid}</TableCell>
                                <TableCell>{user.raidmember ? "Yes" : "No"}</TableCell>
                                <TableCell>{user.ninemember ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Avatar 
                                sx={{ width: 100, height: 100 }} 
                                src={form.lodestoneimage} 
                                alt={form.name} 
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                name="name"
                                fullWidth
                                value={form.name}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                margin="dense"
                                label="Discord"
                                name="discord"
                                fullWidth
                                value={form.discord}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                margin="dense"
                                label="Lodestone ID"
                                name="lodestoneid"
                                fullWidth
                                value={form.lodestoneid}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 item xs={12}>
                            <TextField
                                margin="dense"
                                label="Lodestone Image URL"
                                name="lodestoneimage"
                                fullWidth
                                value={form.lodestoneimage}
                                onChange={handleChange}
                            />
                        </Grid2>
                        <Grid2 item xs={6}>
                            <ToggleButton
                                value="check"
                                selected={form.raidmember}
                                onChange={() => setForm({ ...form, raidmember: !form.raidmember })}
                                fullWidth
                            >
                                Raid Member
                            </ToggleButton>
                        </Grid2>
                        <Grid2 item xs={6}>
                            <ToggleButton
                                value="check"
                                selected={form.ninemember}
                                onChange={() => setForm({ ...form, ninemember: !form.ninemember })}
                                fullWidth
                            >
                                Nine Member
                            </ToggleButton>
                        </Grid2>
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} color="primary">{editingUser ? "Update" : "Save"}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Users;
