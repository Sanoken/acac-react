import React, { useState } from "react";
import { 
    Container, Typography, Button, Grid, Card, CardContent, Avatar, IconButton, 
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, CardActions 
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const Users = () => {
    const [contacts, setContacts] = useState([
        { name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
    { name: "Jane Smith", email: "jane.smith@example.com", phone: "234-567-8901" },
    { name: "Michael Johnson", email: "michael.j@example.com", phone: "345-678-9012" },
    { name: "Emily Davis", email: "emily.d@example.com", phone: "456-789-0123" },
    { name: "Chris Brown", email: "chris.b@example.com", phone: "567-890-1234" },
    { name: "Jessica Wilson", email: "jessica.w@example.com", phone: "678-901-2345" },
    { name: "Daniel Martinez", email: "daniel.m@example.com", phone: "789-012-3456" },
    { name: "Sophia Lee", email: "sophia.l@example.com", phone: "890-123-4567" },
    { name: "Matthew Taylor", email: "matthew.t@example.com", phone: "901-234-5678" },
    { name: "Olivia Anderson", email: "olivia.a@example.com", phone: "012-345-6789" },
    { name: "David Thomas", email: "david.t@example.com", phone: "111-222-3333" },
    { name: "Emma White", email: "emma.w@example.com", phone: "222-333-4444" },
    { name: "James Harris", email: "james.h@example.com", phone: "333-444-5555" },
    { name: "Ava Martin", email: "ava.m@example.com", phone: "444-555-6666" },
    { name: "Liam Garcia", email: "liam.g@example.com", phone: "555-666-7777" },
    { name: "Mia Clark", email: "mia.c@example.com", phone: "666-777-8888" },
    { name: "Benjamin Rodriguez", email: "benjamin.r@example.com", phone: "777-888-9999" },
    { name: "Isabella Lewis", email: "isabella.l@example.com", phone: "888-999-0000" },
    { name: "William Hall", email: "william.h@example.com", phone: "999-000-1111" },
    { name: "Charlotte Young", email: "charlotte.y@example.com", phone: "000-111-2222" },
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
                User Management (Contacts)
            </Typography>

            {/* Add Contact Button */}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Add Contact
            </Button>

            {/* Contact Cards Grid */}
            <Grid container spacing={3}>
                {contacts.map(contact => (
                    <Grid item xs={12} sm={6} md={4} key={contact.id}>
                        <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                            <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56, marginRight: 2 }}>
                                {contact.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{contact.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{contact.email}</Typography>
                                <Typography variant="body2" color="textSecondary">{contact.phone}</Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton color="primary" onClick={() => handleOpen(contact)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(contact.id)}>
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
