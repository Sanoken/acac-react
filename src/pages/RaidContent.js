import React, { useState, useEffect, useCallback, use } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    getRaidfloors, 
    createRaidfloor, 
    updateRaidfloor, 
    deleteRaidfloor 
} from '../services/raidfloorService';
import { 
    getRaiditems,
    createRaiditem,
    updateRaiditem,
    deleteRaiditem
} from '../services/raiditemService';
import { 
    Box, Button, Card, CardContent, TextField, 
    Typography, IconButton, Dialog, DialogActions, 
    DialogContent, DialogTitle, Avatar,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, 
    CircularProgress, DialogContentText
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

    const RaidContent = () => {

    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        //console.log(storedUserInfo);
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            // Check if user is in nine-admin group
            try
            {
                if (parsedInfo.groups.includes('nine-admin')) {
                    setIsAuthorized(true);
                    console.log('Authorized');
                } else {
                    console.log('Not Authorized')
                    navigate('/');
                }
            } catch (error){return navigate('/');}
            
         } else {
            navigate('/');
            //console.log('Not Authorized');
         }
    }, [navigate]);

    const [contentPanels, setContentPanels] = useState([]);
    const [raiditems, setRaiditems] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        floorimage: '',
        order: 1
    });
    const [editingPanel, setEditingPanel] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
    const [itemFormData, setItemFormData] = useState({
        name: '',
        raidimage: '',
        isweapon: false,
        haslist: false,
        order: 1,
        floorid: null
    });
    const [editingItem, setEditingItem] = useState(null);
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    
    // Handle Form Changes for Raid Items
    const handleItemChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItemFormData({
            ...itemFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Open Dialog to Add or Edit Raid Item
    const handleItemDialogOpen = (floorid) => {
        setItemFormData({ 
            name: '',
            raidimage: '',
            isweapon: false,
            haslist: false,
            order: 1,
            floorid: floorid
         });
        setItemDialogOpen(true);
    };

    // Edit Existing Item
    const handleEditItem = (item) => {
        setItemFormData(item);
        setEditingItem(item);
        setItemDialogOpen(true);
    };

    // Submit New or Edited Raid Item
    const handleItemSubmit = async (e) => {
        e.preventDefault();
        if (editingItem) {
            await updateRaiditem(editingItem.id, itemFormData);
        } else {
            await createRaiditem(itemFormData);
        }
        setItemFormData({
            name: '',
            raidimage: '',
            isweapon: false,
            haslist: false,
            order: 1,
            floorId: null
        });
        setEditingItem(null);
        setItemDialogOpen(false);
        fetchRaiditems(); // Refresh Raid Items
    };

    // Delete Raid Item
    const handleDeleteItem = async (id) => {
        await deleteRaiditem(id);
        fetchRaiditems();
    };


    // Fetch Raid Floors
    const fetchRaidfloors = useCallback(async () => {
        setLoading(true);
        const panels = await getRaidfloors();
       // console.log(panels);
        setContentPanels(panels.sort((a, b) => a.order - b.order));
        setLoading(false);
    }, []);

    // Fetch Raid Items
    const fetchRaiditems = useCallback(async () => {
        const items = await getRaiditems();
        //console.log(items);
        setRaiditems(items.sort((a, b) => a.order - b.order));
    }, []);

    useEffect(() => {
        fetchRaidfloors();
        fetchRaiditems();
    }, [fetchRaidfloors, fetchRaiditems]);

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
        setFormData({ name: '', description: '', floorimage: '', order: 1 });
        setEditingPanel(null);
        setDialogOpen(false);
        fetchRaidfloors();
    };

    const handleEdit = (panel) => {
        setFormData(panel);
        setEditingPanel(panel);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        await deleteRaidfloor(confirmDelete.id);
        setConfirmDelete({ open: false, id: null });
        fetchRaidfloors();
    };

    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingPanel(null);
    };

    const handleConfirmDelete = (id) => {
        setConfirmDelete({ open: true, id });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Raid Content Management</Typography>

            <Button variant="contained" color="primary" onClick={handleDialogOpen}>Add New Content</Button><br /><br />

            {loading ? (
                <CircularProgress />
            ) : (
                contentPanels.map((panel) => (
                    <Card key={panel.id} sx={{ marginBottom: 2, position: 'relative'}}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar src={panel.floorimage} alt={panel.name} />
                                <Typography variant="h5">{panel.name}</Typography>
                            </Box>
                            <Typography dangerouslySetInnerHTML={{ __html: panel.description }} />
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <IconButton color="primary" onClick={() => handleEdit(panel)}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="secondary" onClick={() => handleConfirmDelete(panel.id)}>
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
                                        {raiditems
                                            .filter(item => item.floorid === panel.id)
                                            .map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Avatar src={item.raidimage} alt={item.name} />
                                                    </TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.isweapon ? "Yes" : "No"}</TableCell>
                                                    <TableCell>{item.haslist ? "Yes" : "No"}</TableCell>
                                                    <TableCell>{item.order}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="primary" onClick={() => handleEditItem(item)}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton color="secondary" onClick={() => handleDeleteItem(item.id)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>                                                    
                                                </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Button variant="contained" color="primary" onClick={() => handleItemDialogOpen(panel.id)}>Add New Item</Button>
                            </TableContainer>
                        </CardContent>
                    </Card>
                ))
            )}

            <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)}>
                <DialogTitle>{editingItem ? 'Edit Raid Item' : 'Add New Raid Item'}</DialogTitle>
                <DialogContent>
                    <TextField 
                        margin="dense" 
                        name="name" 
                        label="Item Name" 
                        value={itemFormData.name} 
                        onChange={handleItemChange} 
                        fullWidth 
                    />
                    <TextField 
                        margin="dense" 
                        name="raidimage" 
                        label="Item Image URL" 
                        value={itemFormData.raidimage} 
                        onChange={handleItemChange} 
                        fullWidth 
                    />
                    <TextField 
                        margin="dense" 
                        name="order" 
                        label="Order" 
                        type="number" 
                        value={itemFormData.order} 
                        onChange={handleItemChange} 
                        fullWidth 
                    />
                    <Box display="flex" alignItems="center" gap={2}>
                        <label>
                            <input 
                                type="checkbox" 
                                name="isweapon" 
                                checked={itemFormData.isweapon} 
                                onChange={handleItemChange} 
                            />
                            Is Weapon
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="haslist" 
                                checked={itemFormData.haslist} 
                                onChange={handleItemChange} 
                            />
                            Has List
                        </label>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setItemDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleItemSubmit} 
                        variant="contained" 
                        color="primary"
                    >
                        {editingItem ? 'Update Item' : 'Create Item'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{editingPanel ? 'Edit Content' : 'Add New Content'}</DialogTitle>
                <DialogContent>
                    <Avatar src={formData.floorimage} alt="Floor" sx={{ width: 56, height: 56, mb: 2 }} />
                    <TextField margin="dense" name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth />
                    <TextField margin="dense" name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth />
                    <TextField margin="dense" name="floorimage" label="Floor Image URL" value={formData.floorimage} onChange={handleChange} fullWidth />
                    <TextField margin="dense" name="order" label="Order" type="number" value={formData.order} onChange={handleChange} fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">{editingPanel ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this content?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RaidContent;
