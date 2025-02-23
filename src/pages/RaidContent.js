import React, { useState, useEffect } from 'react';
import { 
    getRaidfloors, 
    createRaidfloor, 
    updateRaidfloor, 
    deleteRaidfloor 
} from '../services/raidfloorService';
import { 
    getRaiditems ,
    createRaiditem,
    updateRaiditem,
    deleteRaiditem
} from '../services/raiditemService';
import { Box, Button, Card, CardContent, TextField, 
         Typography, IconButton, Dialog, DialogActions, 
         DialogContent, DialogTitle, Avatar,
         Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const RaidContent = () => {
    const [contentPanels, setContentPanels] = useState([]);
    const [raiditems, setRaiditems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: 1
    });
    const [editingPanel, setEditingPanel] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Fetch content panels from API
    const fetchRaidfloors = async () => {
        const panels = await getRaidfloors();
        setContentPanels(panels);
    };

    const fetchRaiditems = async () => {
        const items = await getRaiditems();
        setRaiditems(items);
    };

    useEffect(() => {
        fetchRaidfloors();
        fetchRaiditems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingPanel) {
            await updateRaidfloor(editingPanel.id, formData);
        } else {
            await createRaidfloor(formData);
        }
        setFormData({ name: '', description: '', order: 1 });
        setEditingPanel(null);
        setDialogOpen(false);
        fetchRaidfloors();
    };

    const handleEdit = (panel) => {
        setFormData(panel);
        setEditingPanel(panel);
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        await deleteRaidfloor(id);
        fetchRaidfloors();
    };

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingPanel(null);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Raid Content Management</Typography>

            <Button variant="contained" color="primary" onClick={handleDialogOpen}>Add New Content</Button><br /><br />

            {contentPanels.map((panel) => (
                <Card key={panel.id} style={{ position: 'relative'}}>
                    <CardContent position="relative">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src={panel.floorimage} alt={panel.name} />
                        <Typography variant="h5">{panel.name}</Typography>
                    </Box>
                    <Typography dangerouslySetInnerHTML={{ __html: panel.description }} />
                    <Box style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                        <IconButton color="primary" onClick={() => handleEdit(panel)}>
                            <Edit />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleDelete(panel.id)}>
                            <Delete />
                        </IconButton>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Is Weapon</TableCell>
                                    <TableCell>Has List</TableCell>
                                    <TableCell>Order</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {raiditems.map(panel => (
                                    <TableRow key={panel.id}>
                                        <TableCell>
                                            <Avatar src={panel.raidimage} alt={panel.name} />
                                        </TableCell>
                                        <TableCell>{panel.name}</TableCell>
                                        <TableCell>{panel.isweapon ? "Yes" : "No"}</TableCell>
                                        <TableCell>{panel.haslist ? "Yes" : "No"}</TableCell>
                                        <TableCell>{panel.order}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{editingPanel ? 'Edit Content' : 'Add New Content'}</DialogTitle>
                <DialogContent>
                <   Avatar src={formData.floorimage}  />
                    <TextField margin="dense" name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                    <TextField margin="dense" name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth />
                    <TextField margin="dense" name="floorimage" label="Floor Image" value={formData.floorimage} onChange={handleChange} fullWidth />
                    <TextField margin="dense" name="order" label="Order" type="number" value={formData.order} onChange={handleChange} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">{editingPanel ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RaidContent;
