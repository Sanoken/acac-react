import React, { useEffect, useState } from "react";
import { 
    Container, Typography, Button, Grid, Card, CardContent, Avatar, IconButton, 
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, CardActions, 
    ToggleButton
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService"; // Import API functions

const Users = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ name: "", discord: "", lodestoneid: "", lodestoneimage: "", raidmember: false, ninemember: false });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
        console.log(data);
    };

    const handleOpen = (user = null) => {
        setEditingUser(user);
        setForm(user || { name: "", discord: "", lodestoneid: "", lodestoneimage: "" , raidmember: false, ninemember: false });
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
            // Update existing user
            await updateUser(editingUser.id, form);
        } else {
            // **✅ Call `createUser` API function to add a new user**
            const newUser = await createUser({
                id: uuidv4(), // Generate a unique ID
                ...form
            });

            if (newUser) {
                setUsers([...users, newUser]); // Update state with the new user
            }
        }

        fetchUsers(); // Refresh the user list
        handleClose();
    };

    const handleDelete = async (id) => {
        await deleteUser(id);
        fetchUsers();
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                User Management
            </Typography>

            {/* Add User Button */}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add User
            </Button>

            {/* User Cards Grid */}
            <Grid container spacing={3}>
                {users.map(user => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                            <Avatar 
                                sx={{ bgcolor: "#1976d2", width: 56, height: 56, marginRight: 2 }} 
                                src={user.lodestoneimage}
                                alt={user.name}  
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Discord: {user.discord}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Lodestone ID: {user.lodestoneid}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Raid Member: {user.raidmember ? "Yes" : "No"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Nine Member: {user.ninemember ? "Yes" : "No"}
                                </Typography>
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

            {/* Add/Edit User Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Avatar 
                                sx={{ width: 100, height: 100 }} 
                                src={form.lodestoneimage} 
                                alt={form.name} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                name="name"
                                fullWidth
                                value={form.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Discord"
                                name="discord"
                                fullWidth
                                value={form.discord}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Lodestone ID"
                                name="lodestoneid"
                                fullWidth
                                value={form.lodestoneid}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Lodestone Image URL"
                                name="lodestoneimage"
                                fullWidth
                                value={form.lodestoneimage}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ToggleButton
                                value="check"
                                selected={form.raidmember}
                                onChange={() => setForm({ ...form, raidmember: !form.raidmember })}
                                fullWidth
                            >
                                Raid Member
                            </ToggleButton>
                        </Grid>
                        <Grid item xs={6}>
                            <ToggleButton
                                value="check"
                                selected={form.ninemember}
                                onChange={() => setForm({ ...form, ninemember: !form.ninemember })}
                                fullWidth
                            >
                                Nine Member
                            </ToggleButton>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {editingUser ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Users;
