import React, { useState } from "react";
import { 
    Container, Typography, Button, Grid, Card, CardContent, Avatar, IconButton, 
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, CardActions 
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const Users = () => {
    const [contacts, setContacts] = useState([
        { name: "Ariela Cooke", discord: "", lodestoneid: "14593575",
            lodestoneimage:"https://img2.finalfantasyxiv.com/f/91dd254ef72947cd1adad181d940f3b0_0e336ff6ad415f47233f0aaf127feac0fc0_96x96.jpg?1588998674",raidmember: false, ninemember: true, admin: false, id: uuidv4() },
        { name: "Ayane Kurogane", discord: "", lodestoneid: "14519392",
            lodestoneimage:"https://img2.finalfantasyxiv.com/f/f48aa156e6a453da222a87b05cacdd86_0e336ff6ad415f47233f0aaf127feac0fc0_96x96.jpg?1611709577",raidmember: false, ninemember: true, admin: false, id: uuidv4() },
        { name: "Babeth Mantear", discord: "babeth_mantear", lodestoneid: "9411542",
            lodestoneimage:"https://img2.finalfantasyxiv.com/f/ed7fd33371b23da3907ded94266b49e7_0e336ff6ad415f47233f0aaf127feac0fc0_96x96.jpg?1688656739",raidmember: false, ninemember: true, admin: true, id: uuidv4() },
    ]);

    const [open, setOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    const handleOpen = (contact = null) => {
        setEditingContact(contact);
        setForm(contact || { name: "", email: "", phone: "" });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingContact(null);
        setForm({ name: "", email: "", phone: "" });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (editingContact) {
            setContacts(contacts.map(c => c.id === editingContact.id ? { ...editingContact, ...form } : c));
        } else {
            setContacts([...contacts, { id: uuidv4(), ...form }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                User Management
            </Typography>

            {/* Add Contact Button */}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add User
            </Button>

            {/* Contact Cards Grid */}
            <Grid container spacing={3}>
                {contacts.map(contact => (
                    <Grid item xs={12} sm={6} md={4} key={contact.id}>
                        <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                            <Avatar 
                                sx={{ bgcolor: "#1976d2", width: 56, height: 56, marginRight: 2 }} 
                                src={contact.lodestoneimage}
                                alt={contact.name}  
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{contact.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{contact.discord}</Typography>
                                <Typography variant="body2" color="textSecondary">{contact.lodestoneid}</Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton color="primary" onClick={() => handleOpen(contact)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(contact.name)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Contact Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingContact ? "Edit Contact" : "Add Contact"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Phone"
                        name="phone"
                        fullWidth
                        value={form.phone}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {editingContact ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Users;
