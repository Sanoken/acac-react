import React, { useEffect, useState } from "react";
import {
    Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Avatar, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, TableSortLabel,
    Grid, Card, CardContent, CardActions, CardHeader, useMediaQuery
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
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        fetchUsers();
    }, []);

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
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (editingUser) {
            await updateUser(editingUser.id, form);
        } else {
            await createUser({ id: uuidv4(), ...form });
        }
        fetchUsers();
        handleClose();
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>User Management</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>Add User</Button>
            
            {/* Table for larger screens */}
            {!isMobile && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel active={true} direction={order}>
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Discord</TableCell>
                                <TableCell>Lodestone ID</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar src={user.lodestoneimage} alt={user.name} /> {user.name}
                                    </TableCell>
                                    <TableCell>{user.discord}</TableCell>
                                    <TableCell>{user.lodestoneid}</TableCell>
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
            )}

            {/* Cards for mobile screens */}
            {isMobile && (
                <Grid container spacing={2}>
                    {users.map((user) => (
                        <Grid item xs={12} key={user.id}>
                            <Card>
                                <CardHeader avatar={<Avatar src={user.lodestoneimage} alt={user.name} />} title={user.name} subheader={`Discord: ${user.discord}`} />
                                <CardContent>
                                    <Typography variant="body2">Lodestone ID: {user.lodestoneid}</Typography>
                                    <Typography variant="body2">Raid Member: {user.raidmember ? "Yes" : "No"}</Typography>
                                    <Typography variant="body2">Nine Member: {user.ninemember ? "Yes" : "No"}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog Form */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Name" name="name" fullWidth value={form.name} onChange={handleChange} />
                    <TextField margin="dense" label="Discord" name="discord" fullWidth value={form.discord} onChange={handleChange} />
                    <TextField margin="dense" label="Lodestone ID" name="lodestoneid" fullWidth value={form.lodestoneid} onChange={handleChange} />
                    <TextField margin="dense" label="Lodestone Image URL" name="lodestoneimage" fullWidth value={form.lodestoneimage} onChange={handleChange} />
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
